from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from datetime import datetime, timedelta
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'hospital_management_secret_key'

# Database initialization
def init_db():
    conn = sqlite3.connect('hospital.db')
    cursor = conn.cursor()
    
    # Patients table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            date_of_birth DATE NOT NULL,
            gender TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT,
            emergency_contact TEXT,
            medical_history TEXT,
            allergies TEXT,
            blood_type TEXT,
            insurance_number TEXT,
            registration_date DATE DEFAULT CURRENT_DATE
        )
    ''')
    
    # Doctors table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL
        )
    ''')
    
    # Appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            appointment_date DATE NOT NULL,
            appointment_time TEXT NOT NULL,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'scheduled',
            notes TEXT,
            FOREIGN KEY (patient_id) REFERENCES patients (id),
            FOREIGN KEY (doctor_id) REFERENCES doctors (id)
        )
    ''')
    
    # Medications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            description TEXT,
            category TEXT
        )
    ''')
    
    # Prescriptions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS prescriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            doctor_id INTEGER,
            medication_id INTEGER,
            quantity INTEGER NOT NULL,
            dosage TEXT NOT NULL,
            duration TEXT NOT NULL,
            prescription_date DATE DEFAULT CURRENT_DATE,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (patient_id) REFERENCES patients (id),
            FOREIGN KEY (doctor_id) REFERENCES doctors (id),
            FOREIGN KEY (medication_id) REFERENCES medications (id)
        )
    ''')
    
    # Bills table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            bill_date DATE DEFAULT CURRENT_DATE,
            due_date DATE NOT NULL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (patient_id) REFERENCES patients (id)
        )
    ''')
    
    # Insert sample doctors
    cursor.execute("SELECT COUNT(*) FROM doctors")
    if cursor.fetchone()[0] == 0:
        sample_doctors = [
            ('Dr. Sarah Johnson', 'Cardiology', '+1-555-123-4567', 'sarah.johnson@hospital.com'),
            ('Dr. Michael Chen', 'Neurology', '+1-555-234-5678', 'michael.chen@hospital.com'),
            ('Dr. Emily Rodriguez', 'Pediatrics', '+1-555-345-6789', 'emily.rodriguez@hospital.com'),
            ('Dr. David Wilson', 'Orthopedics', '+1-555-456-7890', 'david.wilson@hospital.com')
        ]
        cursor.executemany("INSERT INTO doctors (name, specialty, phone, email) VALUES (?, ?, ?, ?)", sample_doctors)
    
    # Insert sample medications
    cursor.execute("SELECT COUNT(*) FROM medications")
    if cursor.fetchone()[0] == 0:
        sample_medications = [
            ('Aspirin', 12.99, 500, 'Pain reliever and anti-inflammatory', 'Pain Relief'),
            ('Amoxicillin', 25.50, 250, 'Antibiotic for bacterial infections', 'Antibiotics'),
            ('Lisinopril', 18.75, 300, 'ACE inhibitor for high blood pressure', 'Cardiovascular'),
            ('Metformin', 22.00, 400, 'Diabetes medication', 'Diabetes'),
            ('Ibuprofen', 15.99, 600, 'Non-steroidal anti-inflammatory drug', 'Pain Relief')
        ]
        cursor.executemany("INSERT INTO medications (name, price, stock, description, category) VALUES (?, ?, ?, ?, ?)", sample_medications)
    
    conn.commit()
    conn.close()

# Database helper functions
def get_db_connection():
    conn = sqlite3.connect('hospital.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

# Patient Registration & EHR Routes
@app.route('/patients')
def patients():
    conn = get_db_connection()
    patients = conn.execute('SELECT * FROM patients ORDER BY registration_date DESC').fetchall()
    conn.close()
    return render_template('patients.html', patients=patients)

@app.route('/register_patient', methods=['GET', 'POST'])
def register_patient():
    if request.method == 'POST':
        try:
            conn = get_db_connection()
            conn.execute('''
                INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, 
                                    address, emergency_contact, medical_history, allergies, blood_type, insurance_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                request.form['first_name'], request.form['last_name'], request.form['date_of_birth'],
                request.form['gender'], request.form['phone'], request.form['email'],
                request.form['address'], request.form['emergency_contact'], request.form['medical_history'],
                request.form['allergies'], request.form['blood_type'], request.form['insurance_number']
            ))
            conn.commit()
            conn.close()
            flash('Patient registered successfully!', 'success')
            return redirect(url_for('patients'))
        except Exception as e:
            flash(f'Error registering patient: {str(e)}', 'error')
    
    return render_template('register_patient.html')

@app.route('/patient/<int:patient_id>')
def patient_details(patient_id):
    conn = get_db_connection()
    patient = conn.execute('SELECT * FROM patients WHERE id = ?', (patient_id,)).fetchone()
    conn.close()
    
    if patient is None:
        flash('Patient not found!', 'error')
        return redirect(url_for('patients'))
    
    return render_template('patient_details.html', patient=patient)

# Doctor Appointments Routes
@app.route('/appointments')
def appointments():
    conn = get_db_connection()
    appointments = conn.execute('''
        SELECT a.*, p.first_name || " " || p.last_name as patient_name, d.name as doctor_name, d.specialty
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
    ''').fetchall()
    conn.close()
    return render_template('appointments.html', appointments=appointments)

@app.route('/schedule_appointment', methods=['GET', 'POST'])
def schedule_appointment():
    if request.method == 'POST':
        try:
            conn = get_db_connection()
            conn.execute('''
                INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                request.form['patient_id'], request.form['doctor_id'], request.form['appointment_date'],
                request.form['appointment_time'], request.form['reason'], request.form['notes']
            ))
            conn.commit()
            conn.close()
            flash('Appointment scheduled successfully!', 'success')
            return redirect(url_for('appointments'))
        except Exception as e:
            flash(f'Error scheduling appointment: {str(e)}', 'error')
    
    conn = get_db_connection()
    patients = conn.execute('SELECT * FROM patients ORDER BY first_name, last_name').fetchall()
    doctors = conn.execute('SELECT * FROM doctors ORDER BY name').fetchall()
    conn.close()
    
    return render_template('schedule_appointment.html', patients=patients, doctors=doctors)

@app.route('/update_appointment/<int:appointment_id>/<status>')
def update_appointment(appointment_id, status):
    try:
        conn = get_db_connection()
        conn.execute('UPDATE appointments SET status = ? WHERE id = ?', (status, appointment_id))
        conn.commit()
        conn.close()
        flash(f'Appointment {status} successfully!', 'success')
    except Exception as e:
        flash(f'Error updating appointment: {str(e)}', 'error')
    
    return redirect(url_for('appointments'))

# Pharmacy & Billing Routes
@app.route('/pharmacy')
def pharmacy():
    conn = get_db_connection()
    prescriptions = conn.execute('''
        SELECT p.*, pt.first_name || " " || pt.last_name as patient_name, 
               d.name as doctor_name, m.name as medication_name, m.price
        FROM prescriptions p
        JOIN patients pt ON p.patient_id = pt.id
        JOIN doctors d ON p.doctor_id = d.id
        JOIN medications m ON p.medication_id = m.id
        ORDER BY p.prescription_date DESC
    ''').fetchall()
    medications = conn.execute('SELECT * FROM medications ORDER BY name').fetchall()
    conn.close()
    return render_template('pharmacy.html', prescriptions=prescriptions, medications=medications)

@app.route('/create_prescription', methods=['GET', 'POST'])
def create_prescription():
    if request.method == 'POST':
        try:
            conn = get_db_connection()
            
            # Get medication price
            medication = conn.execute('SELECT price FROM medications WHERE id = ?', 
                                    (request.form['medication_id'],)).fetchone()
            total_amount = medication['price'] * int(request.form['quantity'])
            
            conn.execute('''
                INSERT INTO prescriptions (patient_id, doctor_id, medication_id, quantity, dosage, duration, total_amount)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                request.form['patient_id'], request.form['doctor_id'], request.form['medication_id'],
                request.form['quantity'], request.form['dosage'], request.form['duration'], total_amount
            ))
            conn.commit()
            conn.close()
            flash('Prescription created successfully!', 'success')
            return redirect(url_for('pharmacy'))
        except Exception as e:
            flash(f'Error creating prescription: {str(e)}', 'error')
    
    conn = get_db_connection()
    patients = conn.execute('SELECT * FROM patients ORDER BY first_name, last_name').fetchall()
    doctors = conn.execute('SELECT * FROM doctors ORDER BY name').fetchall()
    medications = conn.execute('SELECT * FROM medications ORDER BY name').fetchall()
    conn.close()
    
    return render_template('create_prescription.html', patients=patients, doctors=doctors, medications=medications)

@app.route('/update_prescription/<int:prescription_id>/<status>')
def update_prescription(prescription_id, status):
    try:
        conn = get_db_connection()
        conn.execute('UPDATE prescriptions SET status = ? WHERE id = ?', (status, prescription_id))
        conn.commit()
        conn.close()
        flash(f'Prescription {status} successfully!', 'success')
    except Exception as e:
        flash(f'Error updating prescription: {str(e)}', 'error')
    
    return redirect(url_for('pharmacy'))

@app.route('/billing')
def billing():
    conn = get_db_connection()
    bills = conn.execute('''
        SELECT b.*, p.first_name || " " || p.last_name as patient_name
        FROM bills b
        JOIN patients p ON b.patient_id = p.id
        ORDER BY b.bill_date DESC
    ''').fetchall()
    conn.close()
    return render_template('billing.html', bills=bills)

@app.route('/create_bill', methods=['GET', 'POST'])
def create_bill():
    if request.method == 'POST':
        try:
            due_date = datetime.strptime(request.form['bill_date'], '%Y-%m-%d') + timedelta(days=30)
            
            conn = get_db_connection()
            conn.execute('''
                INSERT INTO bills (patient_id, description, amount, bill_date, due_date)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                request.form['patient_id'], request.form['description'], request.form['amount'],
                request.form['bill_date'], due_date.strftime('%Y-%m-%d')
            ))
            conn.commit()
            conn.close()
            flash('Bill created successfully!', 'success')
            return redirect(url_for('billing'))
        except Exception as e:
            flash(f'Error creating bill: {str(e)}', 'error')
    
    conn = get_db_connection()
    patients = conn.execute('SELECT * FROM patients ORDER BY first_name, last_name').fetchall()
    conn.close()
    
    return render_template('create_bill.html', patients=patients)

@app.route('/update_bill/<int:bill_id>/<status>')
def update_bill(bill_id, status):
    try:
        conn = get_db_connection()
        conn.execute('UPDATE bills SET status = ? WHERE id = ?', (status, bill_id))
        conn.commit()
        conn.close()
        flash(f'Bill marked as {status} successfully!', 'success')
    except Exception as e:
        flash(f'Error updating bill: {str(e)}', 'error')
    
    return redirect(url_for('billing'))

# API endpoints for dynamic responses
@app.route('/api/patient_search')
def patient_search():
    query = request.args.get('q', '')
    conn = get_db_connection()
    patients = conn.execute('''
        SELECT id, first_name, last_name FROM patients 
        WHERE first_name LIKE ? OR last_name LIKE ?
        LIMIT 10
    ''', (f'%{query}%', f'%{query}%')).fetchall()
    conn.close()
    
    return jsonify([{
        'id': patient['id'],
        'name': f"{patient['first_name']} {patient['last_name']}"
    } for patient in patients])

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)