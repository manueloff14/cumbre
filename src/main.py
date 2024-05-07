from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import random
from urllib.parse import urlparse
from urllib.parse import quote
import string
import requests
from functools import wraps
from collections import Counter
from datetime import datetime, timedelta, timezone
import locale
import smtplib
import ssl
from email.message import EmailMessage

app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui'

# Inicializar la aplicación Firebase una sola vez
cred = credentials.Certificate("/home/user/cumbre/src/static/json/cumbre-database.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

# Establecer la localización para usar puntos como separadores de miles
locale.setlocale(locale.LC_ALL, 'es_ES.UTF-8')  # Ajusta esto según tu localización

@app.template_filter('format_number')
def format_number(value):
    try:
        # Asegurar que el valor es un float
        numeric_value = float(value)
        # Formatear el número con dos decimales y separadores de miles
        return locale.format_string("%,.2f", numeric_value, grouping=True)
    except (TypeError, ValueError):
        return value  # Si hay un error, devolver el valor original sin modificar


# Añadir el filtro al entorno de Jinja
app.jinja_env.filters['format_number'] = format_number

# Función para obtener el saldo
def obtener_saldo(username):
    dinero_doc = db.collection('dinero').document(username).get()
    if dinero_doc.exists:
        return dinero_doc.to_dict().get('saldo', 0)
    return 0

# Función para obtener el total de clicks y enlaces
def obtener_clicks_y_enlaces(username):
    user_doc = db.collection('usuarios').document(username).get()
    if user_doc.exists:
        links = user_doc.to_dict().get('links', [])
        total_clicks = sum(len(link.get('clicks', [])) for link in links)
        return total_clicks, len(links)
    return 0, 0

# Función para obtener las transferencias
def obtener_transferencias(username):
    # Suponemos que cada documento de 'transferencias' tiene un campo 'fecha'
    # y que es de tipo Timestamp o similar que Firestore puede ordenar
    transferencias = db.collection('dinero').document(username).collection('transferencias') \
                       .order_by('fecha', direction=firestore.Query.DESCENDING).stream()
    return [trans.to_dict() for trans in transferencias]

# Función para obtener los clicks por día para los últimos 7 días
def obtener_clicks_por_dia(username):
    user_doc = db.collection('usuarios').document(username).get()
    if user_doc.exists:
        links = user_doc.to_dict().get('links', [])
        clicks_por_dia = {str((datetime.utcnow().date() - timedelta(days=i))): 0 for i in range(7)}
        for link in links:
            for click in link.get('clicks', []):
                click_date_str = click.get('time_zone_current_time', '')  # Obtener la cadena de fecha y hora
                if click_date_str:  # Verificar si la cadena no está vacía
                    try:
                        click_date = datetime.strptime(click_date_str, "%Y-%m-%dT%H:%M:%S%z").date()
                        if str(click_date) in clicks_por_dia:
                            clicks_por_dia[str(click_date)] += 1
                    except ValueError:
                        # Manejar casos en los que la fecha y hora no se puedan analizar correctamente
                        pass
        return clicks_por_dia
    return {}
    
def check_logged_in():
    return 'username' in session

def check_user_exists(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login_page'))

        username = session['username']
        user_doc = db.collection('usuarios').document(username).get()
        if not user_doc.exists:
            session.pop('username', None)
            return redirect(url_for('login_page'))

        return f(*args, **kwargs)
    return decorated_function

# Decorador para requerir inicio de sesión y verificar si el usuario existe en la base de datos
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            print("No estás autenticado. Por favor, inicia sesión.")
            return redirect(url_for('login_page'))
        else:
            print("Estás autenticado.")
            return f(*args, **kwargs)
    return decorated_function

@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        username_or_email = request.form['username']
        user_ref = db.collection('usuarios').where('username', '==', username_or_email).get()
        if not user_ref:
            user_ref = db.collection('usuarios').where('email', '==', username_or_email).get()
        if user_ref:
            user_data = user_ref[0].to_dict()
            username = user_data['username']
            email = user_data['email']

            # Generar y actualizar nueva contraseña
            new_password = ''.join(random.choices(string.ascii_letters + string.digits, k=30))
            db.collection('usuarios').document(username).update({'password': new_password})

            # Preparar y enviar correo
            email_sender = 'correoscumbre@gmail.com'
            email_alias = "soporte@cumbre.icu"
            smtp_password = 'vmqc lkje krvi zrre'
            email_recipient = email
            subject = "Tu nueva contraseña temporal"
            body = f"""\
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <table style="width: 100%; border-spacing: 0;">
        <tbody>
            <!-- Cabecera con logos -->
            <tr style="background-color: #180e0e;">
                <td style="padding: 30px;">
                    <a href="https://app.cumbre.icu">
                        <img src="https://i.ibb.co/XjJXNPf/cumbre-cucuta.png" alt="" style="width: 150px;">
                    </a>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <a href="" style="text-decoration: none; color: #ececec; font-size: 12px; padding: 10px 20px; background-color: rgb(221, 65, 65); border-radius: 10px;">Acceder</a>
                </td>
            </tr>
            <!-- Sección de bienvenida -->
            <tr>
                <td colspan="2" style="padding: 30px;">
                    <h1 style="font-size: 300%; margin-bottom: 10px; margin: 0px 0px;">Nueva contraseña temporal</h1>
                    <p>Hemos establecido una contraseña temporal.</p>
                    <br>
                    <p>Por favor, cambia la contraseña una vez inicies sesión.</p>
                    <p>Si no solicitaste este cambio, puedes contactarnos a través de <span style="font-weight: bold; color: rgb(86, 86, 207);"><a href="mailto:contacto@cumbre.icu">contacto@cumbre.icu</a></span>. Estaremos dispuestos a cualquier solicitud.</p>
                    <p>Tu nueva contraseña es: <strong>{new_password}</strong></p>
                </td>
            </tr>
            <!-- Pie de página con dos columnas -->
            <tr style="background: black; color: rgb(212, 212, 212); font-size: 12px;">
                <td style="padding: 30px; width: 70%;">
                    <span style="color: white;">Con ❤️ desde Cúcuta, la capital Nortesantandereana; para el globo</span>
                    <br><br>
                    <p>
                        Este correo fue enviado a <strong>{email_recipient}</strong>.
                        Si tienes algún problema, no dudes en contactarnos a través de <a href="mailto:soporte@cumbre.icu" target="_blank" style="color: rgb(212, 212, 212);"><strong>soporte@cumbre.icu</strong></a> o en <a href="https://cumbre.icu/contactanos" target="_blank" style="color: rgb(212, 212, 212);"><strong>/contactanos</strong></a>.
                    </p>
                    <br>
                    <span><a style="color: white;" href="https://cumbre.icu/t&c"><strong>Términos y condiciones</strong></a> | <a href="https://cumbre.icu/politica" style="color: white;"><strong>Política</strong></a> | <a href="https://cumbre.icu/contactanos" style="color: white;"><strong>Contáctanos</strong></a></span>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <img src="https://i.ibb.co/CW1Sf1m/cumbre-logo.png" alt="" style="width: 100px; margin: 10px 0px">
                    <div style="font-size: 10px;">Copyright © 2024, <a href="https://cumbre.icu" style="color: white;">Cumbre</a></div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>"""

            em = EmailMessage()
            em['From'] = email_alias
            em['To'] = email_recipient
            em['Subject'] = subject
            em.set_content(body, subtype='html')

            # Enviar correo
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                smtp.login(email_sender, smtp_password)
                smtp.send_message(em)

            return 'Un email con la nueva contraseña ha sido enviado.', 200
        else:
            return 'Usuario no encontrado.', 404
    return render_template('reset_password.html')

@app.route('/logout')
def logout():
    # Eliminar al usuario de la sesión
    session.pop('username', None)
    # Redirigir al usuario a la página de inicio de sesión
    return redirect(url_for('login_page'))

def generate_card_number():
    """Genera un número de tarjeta único verificando contra la base de datos."""
    while True:
        card_number = ''.join(str(random.randint(0, 9)) for _ in range(16))
        existing_card = db.collection('dinero').where('card_number', '==', card_number).get()
        if not existing_card:
            return card_number

@app.route('/register', methods=['GET', 'POST'])
def register_page():
    if check_logged_in():
        return redirect(url_for('panel_page'))
    
    if request.method == 'POST':
        email = request.form['email']
        username = request.form['username']
        password = request.form['password']
        
        user_doc = db.collection('usuarios')
        query = user_doc.where('email', '==', email).get()
        if query:
            flash('El email ya está registrado')
            return render_template('registro.html', username=username)

        user_doc = db.collection('usuarios')
        query = user_doc.where('username', '==', username).get()
        if query:
            flash('El usuario ya se encuentra registrado')
            return render_template('registro.html', email=email)

        # Fecha actual en UTC
        utc_now = datetime.utcnow()

        # Registrar el usuario en la colección 'usuarios' con la fecha de registro
        doc_ref = db.collection('usuarios').document(username)
        doc_ref.set({
            'email': email,
            'username': username,
            'password': password,  # Considera usar algún método de hashing para la contraseña antes de guardarla
            'fecha_de_registro': utc_now.strftime('%d/%m/%Y %H:%M:%S')  # Fecha y hora en formato día/mes/año horas:minutos:segundos
        })

        # Generar número de tarjeta único
        card_number = generate_card_number()
        
        # Crear documento en la colección 'dinero' con la fecha de expedición
        dinero_doc_ref = db.collection('dinero').document(username)
        dinero_doc_ref.set({
            'card_number': card_number,
            'fecha_expedicion': utc_now.strftime('%d/%m/%Y')  # Formato día/mes/año
        })

        # Configuración del correo electrónico
        email_sender = 'correoscumbre@gmail.com'
        email_alias = "soporte@cumbre.icu"
        smtp_password = 'vmqc lkje krvi zrre'
        email_recipient = email
        subject = "Bienvenido a Nuestro Servicio de Acortamiento de Enlaces!"
        body = f"""\
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <table style="width: 100%; border-spacing: 0;">
        <tbody>
            <!-- Cabecera con logos -->
            <tr style="background-color: #180e0e;">
                <td style="padding: 30px;">
                    <a href="https://app.cumbre.icu">
                        <img src="https://i.ibb.co/XjJXNPf/cumbre-cucuta.png" alt="" style="width: 150px;">
                    </a>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <a href="" style="text-decoration: none; color: #ececec; font-size: 12px; padding: 10px 20px; background-color: rgb(221, 65, 65); border-radius: 10px;">Acceder</a>
                </td>
            </tr>
            <!-- Sección de bienvenida -->
            <tr>
                <td colspan="2" style="padding: 30px;">
                    <h1 style="font-size: 300%; margin-bottom: 10px; margin: 0px 0px;">Bienvenido a Cumbre, {username}</h1>
                    <p>Estamos orgullosos de que nos hayas elegido para acompañarte en esta nueva travesía.</p>
                </td>
            </tr>
            <!-- Pie de página con dos columnas -->
            <tr style="background: black; color: rgb(212, 212, 212); font-size: 12px;">
                <td style="padding: 30px; width: 70%;">
                    <span style="color: white;">Con ❤️ desde Cúcuta, la capital Nortesantandereana; para el globo</span>
                    <br><br>
                    <p>
                        Este correo fue enviado a <strong>{email_recipient}</strong>.
                        Si tienes algún problema, no dudes en contactarnos a través de <a href="mailto:soporte@cumbre.icu" target="_blank" style="color: rgb(212, 212, 212);"><strong>soporte@cumbre.icu</strong></a> o en <a href="https://cumbre.icu/contactanos" target="_blank" style="color: rgb(212, 212, 212);"><strong>/contactanos</strong></a>.
                    </p>
                    <br>
                    <span><a style="color: white;" href="https://cumbre.icu/t&c"><strong>Términos y condiciones</strong></a> | <a href="https://cumbre.icu/politica" style="color: white;"><strong>Política</strong></a> | <a href="https://cumbre.icu/contactanos" style="color: white;"><strong>Contáctanos</strong></a></span>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <img src="https://i.ibb.co/CW1Sf1m/cumbre-logo.png" alt="" style="width: 100px; margin: 10px 0px">
                    <div style="font-size: 10px;">Copyright © 2024, <a href="https://cumbre.icu" style="color: white;">Cumbre</a></div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>"""

        # Enviar correo
        em = EmailMessage()
        em['From'] = email_alias
        em['To'] = email_recipient
        em['Subject'] = subject
        em.set_content(body, subtype='html')

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(email_sender, smtp_password)
            smtp.send_message(em)

        return redirect(url_for('login_page'))
    else:
        return render_template('registro.html')

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if check_logged_in():
        return redirect(url_for('panel_page'))
    
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Buscar el usuario en Firestore
        user_doc = db.collection('usuarios').document(username).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            # Verificar si la contraseña es correcta
            if user_data['password'] == password:
                # Guardar el nombre de usuario y el correo electrónico en la sesión
                session['username'] = username
                session['email'] = user_data['email']  # Guardar el correo electrónico en la sesión
                return redirect(url_for('panel_page'))
            else:
                flash('Contraseña incorrecta.')
                return render_template('iniciar_sesion.html', username=username)
        else:
            flash('Usuario no encontrado.')
        # Redirige al login si algo falla
        return redirect(url_for('login_page'))

    # Si el método es GET o cualquier fallo en POST, muestra la página de login
    return render_template('iniciar_sesion.html')

@app.route('/')
def index():
    return redirect(url_for('panel_page'))

@app.route('/acortar_enlace', methods=['POST'])
def acortar_enlace():
    if 'username' not in session:
        # flash('Debes iniciar sesión para acceder a esta funcionalidad.')
        return redirect(url_for('login_page'))
    
    long_link = request.form['long_link']
    title = request.form['title']
    username = session['username']

    if not long_link:
        # flash('El enlace largo es necesario.')
        return redirect(url_for('acortar_page'))

    # Extraer el host de la URL
    host = urlparse(long_link).netloc
    if not host:
        flash('No se pudo extraer el host de la URL proporcionada. Verifica el enlace.')
        return redirect(url_for('acortar_page'))

    favicon_url = f"https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://{host}"

    # Intentar generar un enlace corto único
    unique_short_link = False
    attempts = 0
    while not unique_short_link and attempts < 5:
        short_link = generate_short_link()
        if not short_link_exists(short_link):
            unique_short_link = True
        attempts += 1

    if not unique_short_link:
        # flash('No se pudo generar un enlace corto único. Intenta de nuevo.')
        return redirect(url_for('acortar_page'))

    try:
        user_doc_ref = db.collection('usuarios').document(username)
        new_link_data = {
            'long_link': long_link,
            'title': title,
            'short_link': short_link,
            'favicon_url': favicon_url
        }
        user_doc_ref.update({'links': firestore.ArrayUnion([new_link_data])})

        # Registrar el enlace corto globalmente
        db.collection('short_links').document(short_link).set({'username': username})
        # flash('Enlace acortado correctamente.')
    except Exception as e:
        print(e)
        # flash('Error al acortar el enlace.')
    
    return redirect(url_for('acortar_page'))

def generate_short_link():
    length_of_link = 8
    characters = string.ascii_letters + string.digits
    short_link = ''.join(random.choice(characters) for _ in range(length_of_link))
    return short_link

def short_link_exists(short_link):
    doc = db.collection('short_links').document(short_link).get()
    return doc.exists

@app.route('/acortar')
@login_required
@check_user_exists
def acortar_page():
    return render_template('routes/acortar.html')

@app.route('/transferencias', methods=['GET'])
@login_required
@check_user_exists
def transferencias_page():
    username = session.get('username')
    if not username:
        flash("Por favor, inicie sesión para ver esta página.")
        return redirect(url_for('login_page'))
    
    saldo = obtener_saldo(username)
    total_clicks, total_enlaces = obtener_clicks_y_enlaces(username)
    transferencias = obtener_transferencias(username)
    transferencias.reverse()  # Invierte la lista para mostrar la más reciente primero
    
    clicks_por_dia = obtener_clicks_por_dia(username)

    return render_template('routes/transferencias.html', 
                           saldo=saldo, 
                           total_clicks=total_clicks, 
                           total_enlaces=total_enlaces, 
                           transferencias=transferencias, 
                           clicks_por_dia=clicks_por_dia)

@app.route('/retirar')
@login_required
@check_user_exists
def retirar():
    return render_template('routes/retirar.html')

@app.route('/procesar_retiro', methods=['POST'])
@login_required
@check_user_exists
def procesar_retiro():
    username = session['username']  # Asegurarse de que el usuario está autenticado
    db = firestore.client()

    # Datos enviados desde el formulario
    number_account = request.form['number_account']
    bank = request.form['bank']
    account_type = request.form['account_type']
    clicks_solicitados = int(request.form['clicks'])  # Asegúrate de manejar errores en caso necesario

    # Acceder a la colección 'dinero' y subcolección del usuario para verificar el saldo
    saldo_doc = db.collection('dinero').document(username).get()
    if saldo_doc.exists:
        saldo_data = saldo_doc.to_dict()
        saldo_disponible = saldo_data.get('saldo', 0)

        if saldo_disponible >= clicks_solicitados:
            # Procesar el retiro
            utc_now = datetime.utcnow().strftime('%d/%m/%Y %H:%M:%S')  # Corregido para usar timezone correctamente

            # Actualizar el saldo
            nuevo_saldo = saldo_disponible - clicks_solicitados
            db.collection('dinero').document(username).update({'saldo': nuevo_saldo})

            # Guardar la transferencia en la colección 'transferencias'
            transferencia = {
                'username': username,
                'fecha': utc_now,  # Guarda como Timestamp
                'cantidad_clicks': clicks_solicitados,
                'dinero': clicks_solicitados * 0.015,  # Calcula el dinero basado en los clicks
                'numero_cuenta': number_account,
                'banco': bank,
                'tipo_cuenta': account_type
            }
            db.collection('dinero').document(username).collection('transferencias').add(transferencia)

            # Preparar y enviar correo
            email_sender = 'correoscumbre@gmail.com'
            email_alias = "soporte@cumbre.icu"
            smtp_password = 'vmqc lkje krvi zrre'
            email_recipient = db.collection('usuarios').document(username).get().to_dict()['email']
            subject = "Confirmación de Retiro de Fondos"
            body = f"""\
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
    <table style="width: 100%; border-spacing: 0;">
        <tbody>
            <!-- Cabecera con logos -->
            <tr style="background-color: #180e0e;">
                <td style="padding: 30px;">
                    <a href="https://app.cumbre.icu">
                        <img src="https://i.ibb.co/XjJXNPf/cumbre-cucuta.png" alt="" style="width: 150px;">
                    </a>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <a href="" style="text-decoration: none; color: #ececec; font-size: 12px; padding: 10px 20px; background-color: rgb(221, 65, 65); border-radius: 10px;">Acceder</a>
                </td>
            </tr>
            <!-- Sección de bienvenida -->
            <tr>
                <td colspan="2" style="padding: 30px;">
                    <h1 style="font-size: 300%; margin-bottom: 10px; margin: 0px 0px;">Retiro Procesado</h1>
                    <p>{username}, hemos procesado un retiro de fondos.</p>
                    <br>
                    <p>Por favor, tenga en cuenta que se enviará el dinero a la cuenta con los siguientes datos.</p>
                    <p>Si no solicitaste este retiro, puedes contactarnos urgentemente a través de <span style="font-weight: bold; color: rgb(86, 86, 207);"><a href="mailto:contacto@cumbre.icu">contacto@cumbre.icu</a></span>. Estaremos dispuestos a cualquier solicitud.</p>
                    <ul>
                        <li>Número de cuenta: {number_account}</li>
                        <li>Banco: {bank}</li>
                        <li>Tipo de cuenta: {account_type}</li>
                        <li>Cantidad de clicks retirados: {clicks_solicitados}</li>
                        <li>Monto retirado: ${clicks_solicitados * 0.015:.2f}</li>
                    </ul>
                </td>
            </tr>
            <!-- Pie de página con dos columnas -->
            <tr style="background: black; color: rgb(212, 212, 212); font-size: 12px;">
                <td style="padding: 30px; width: 70%;">
                    <span style="color: white;">Con ❤️ desde Cúcuta, la capital Nortesantandereana; para el globo</span>
                    <br><br>
                    <p>
                        Este correo fue enviado a <strong>{email_recipient}</strong>.
                        Si tienes algún problema, no dudes en contactarnos a través de <a href="mailto:soporte@cumbre.icu" target="_blank" style="color: rgb(212, 212, 212);"><strong>soporte@cumbre.icu</strong></a> o en <a href="https://cumbre.icu/contactanos" target="_blank" style="color: rgb(212, 212, 212);"><strong>/contactanos</strong></a>.
                    </p>
                    <br>
                    <span><a style="color: white;" href="https://cumbre.icu/t&c"><strong>Términos y condiciones</strong></a> | <a href="https://cumbre.icu/politica" style="color: white;"><strong>Política</strong></a> | <a href="https://cumbre.icu/contactanos" style="color: white;"><strong>Contáctanos</strong></a></span>
                </td>
                <td style="padding: 30px; text-align: right;">
                    <img src="https://i.ibb.co/CW1Sf1m/cumbre-logo.png" alt="" style="width: 100px; margin: 10px 0px">
                    <div style="font-size: 10px;">Copyright © 2024, <a href="https://cumbre.icu" style="color: white;">Cumbre</a></div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>"""

            em = EmailMessage()
            em['From'] = email_alias
            em['To'] = email_recipient
            em['Subject'] = subject
            em.set_content(body, subtype='html')

            # Enviar correo
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
                smtp.login(email_sender, smtp_password)
                smtp.send_message(em)

            flash('Retiro procesado correctamente. Un email de confirmación ha sido enviado.', 'success')
            return redirect(url_for('panel_page'))
        else:
            flash('No tienes suficientes fondos para retirar.', 'error')
            return redirect(url_for('vista_formulario_retiro'))
    else:
        flash('Error en la operación.', 'error')
        return redirect(url_for('vista_formulario_retiro'))

@app.route('/ajustes')
@login_required
@check_user_exists
def ajustes_page():
    return render_template('routes/ajustes.html')

def get_browser_clicks_data():
    # Asumiendo que 'db' ya está importado y configurado en alguna parte del archivo
    db = firestore.client()
    all_clicks = db.collection('usuarios').stream()

    browser_clicks = {}

    for user in all_clicks:
        user_data = user.to_dict()
        links = user_data.get('links', [])
        for link in links:
            for click in link.get('clicks', []):
                browser = click['navegador']
                if browser in browser_clicks:
                    browser_clicks[browser] += 1
                else:
                    browser_clicks[browser] = 1

    return browser_clicks

@app.route('/estadisticas')
@login_required
@check_user_exists
def estadisticas_page():
    username = session.get('username')
    if not username:
        flash('No se ha iniciado sesión correctamente.', 'error')
        return redirect(url_for('login_page'))

    try:
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])

            # Extraer detalles adicionales de cada enlace junto con los clicks
            links_with_clicks = [(link, len(link.get('clicks', []))) for link in links]
            # Ordenar los enlaces por número de clicks, descendente
            links_sorted_by_clicks = sorted(links_with_clicks, key=lambda x: x[1], reverse=True)[:4]

            # Contar clicks por país
            country_clicks = {}
            for link in links:
                for click in link.get('clicks', []):
                    country_name = click['country_name']
                    flag = click['flag']
                    if country_name in country_clicks:
                        country_clicks[country_name]['count'] += 1
                    else:
                        country_clicks[country_name] = {'count': 1, 'flag': flag}

            # Ordenar los países por cantidad de clicks
            countries_sorted_by_clicks = sorted(country_clicks.items(), key=lambda x: x[1]['count'], reverse=True)[:5]

            # Obtener los datos de clicks por navegador
            browser_clicks = get_browser_clicks_data()

            return render_template('routes/estadisticas.html', links=links_sorted_by_clicks, countries=countries_sorted_by_clicks, browser_clicks=browser_clicks)
        else:
            return 'Usuario no encontrado'
    except Exception as e:
        return f'Error al recuperar los enlaces de la base de datos: {e}'
        
@app.route('/panel')
@login_required
@check_user_exists
def panel_page():
    username = session['username']
    db = firestore.client()

    # Obtener los datos del documento de dinero
    dinero_doc = db.collection('dinero').document(username).get()
    if dinero_doc.exists:
        dinero_data = dinero_doc.to_dict()
        
        # Obtener el saldo
        saldo = dinero_data.get('saldo', 0)

        # Obtener el número de tarjeta y formatearlo
        raw_card_number = dinero_data.get('card_number', 'No disponible')
        if raw_card_number != 'No disponible':
            # Insertar un guion cada cuatro dígitos
            card_number = '-'.join(raw_card_number[i:i+4] for i in range(0, len(raw_card_number), 4))
        else:
            card_number = 'No disponible'

        fecha_expedicion = dinero_data.get('fecha_expedicion', 'No disponible')
        saldo_actual = dinero_data.get('saldo', 0)
        saldo_ajustado = float(round(saldo_actual * 0.015, 2))  # Aseguramos que es un float

        # Recuperar todas las transferencias utilizando la función auxiliar
        lista_transferencias = obtener_transferencias(username)

        return render_template('routes/panel.html', username=username, card_number=card_number,
                               fecha_expedicion=fecha_expedicion, saldo_ajustado=saldo_ajustado, saldo=saldo,
                               transferencias=lista_transferencias)
    else:
        flash('Datos financieros no encontrados.', 'error')
        return redirect(url_for('login_page'))

@app.route('/enlaces')
@login_required
@check_user_exists
def enlaces_page():
    username = session.get('username')
    if not username:
        flash('No se ha iniciado sesión correctamente.', 'error')
        return redirect(url_for('login_page'))

    db = firestore.client()
    try:
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])
        else:
            flash('No se encontraron enlaces para este usuario.', 'error')
            links = []
    except Exception as e:
        print(f"Error al recuperar los enlaces: {e}")
        flash('Error al recuperar los enlaces desde la base de datos.', 'error')
        links = []

    return render_template('routes/enlaces.html', links=links)

@app.route('/editar_enlace', methods=['POST'])
@login_required
@check_user_exists
def editar_enlace():
    username = session.get('username')
    if not username:
        flash('Usuario no autenticado', 'error')
        return redirect(url_for('login_page'))

    titulo = request.form['tituloEditar']
    enlaceCorto = request.form['enlaceCortoEditar']
    enlaceLargo = request.form['enlaceLargoEditar']

    try:
        # Obtener referencia al documento del usuario
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])
            # Buscar y actualizar el enlace específico
            for link in links:
                if link['short_link'] == enlaceCorto:
                    # Actualizar título y enlace largo
                    link['title'] = titulo
                    if link['long_link'] != enlaceLargo:  # Verificar si el enlace largo ha cambiado
                        link['long_link'] = enlaceLargo
                        # Extraer el host del nuevo enlace largo
                        host = urlparse(enlaceLargo).netloc
                        # Actualizar la URL del favicon
                        link['favicon_url'] = f"https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://{host}"
                    break
            else:
                flash('Enlace no encontrado', 'error')
                return redirect(url_for('enlaces_page'))

            # Actualizar el documento con los nuevos datos
            user_doc_ref.update({'links': links})
            flash('Enlace actualizado correctamente', 'success')
        else:
            flash('Usuario no encontrado', 'error')

    except Exception as e:
        print(f"Error al actualizar el enlace: {e}")
        flash('Error al actualizar el enlace', 'error')

    return redirect(url_for('enlaces_page'))

@app.route('/get_link_data')
def get_link_data():
    username = session.get('username')  # Obtener el username desde la sesión
    if not username:
        return jsonify({'error': 'Usuario no autenticado'}), 401

    short_link = request.args.get('shortLink')
    try:
        # Obtener el documento del usuario
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])
            # Buscar el enlace específico
            link_data = next((item for item in links if item['short_link'] == short_link), None)
            if link_data:
                return jsonify(link_data)
            else:
                return jsonify({'error': 'Enlace no encontrado'}), 404
        else:
            return jsonify({'error': 'Documento de usuario no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': 'Error al obtener los datos: ' + str(e)}), 500

@app.route('/eliminar_enlace', methods=['POST'])
@login_required
@check_user_exists
def eliminar_enlace():
    username = session.get('username')
    enlaceCorto = request.form['enlaceCorto']

    try:
        # Eliminar enlace de la colección del usuario
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])
            new_links = [link for link in links if link['short_link'] != enlaceCorto]
            if len(links) != len(new_links):
                user_doc_ref.update({'links': new_links})
            else:
                flash('Enlace no encontrado en el usuario.', 'error')
                return redirect(url_for('enlaces_page'))

        # Eliminar enlace de la colección global de enlaces cortos
        short_link_doc_ref = db.collection('short_links').document(enlaceCorto)
        short_link_doc = short_link_doc_ref.get()
        if short_link_doc.exists:
            short_link_doc_ref.delete()
        else:
            flash('Enlace no encontrado en la colección global.', 'warning')  # Advertir si no se encuentra

        flash('Enlace eliminado correctamente.', 'success')
    except Exception as e:
        print(f"Error al eliminar el enlace: {e}")
        flash('Error al eliminar el enlace.', 'error')

    return redirect(url_for('enlaces_page'))

@app.route('/obtener')
def obtener():
    referrer = request.headers.get('Referer', 'Acceso directo')
    return render_template('ubicacion.html', referrer=referrer)

@app.route('/<short_link>')
def view_short_link(short_link):
    # Obtener el referrer del encabezado de la solicitud, con un valor por defecto
    referrer = request.headers.get('Referer', 'Acceso directo')

    try:
        # Buscar el enlace en la colección global de enlaces cortos
        link_doc = db.collection('short_links').document(short_link).get()
        if link_doc.exists:
            # Si el documento existe, obtén los datos
            link_data = link_doc.to_dict()
            username = link_data['username']

            # Buscar detalles adicionales del enlace en los datos del usuario
            user_doc_ref = db.collection('usuarios').document(username)
            user_doc = user_doc_ref.get()
            if user_doc.exists:
                user_data = user_doc.to_dict()
                for link in user_data.get('links', []):
                    if link['short_link'] == short_link:
                        # Pasar cada detalle como una variable separada al template, incluyendo el referrer
                        return render_template('view_link.html', 
                                               title=link['title'],
                                               long_link=link['long_link'],
                                               short_link=link['short_link'],
                                               favicon_url=link.get('favicon_url', ''),
                                               referrer=referrer)  # Pasando el referrer al template
            flash('Enlace no encontrado en los registros del usuario.', 'error')
        else:
            flash('Enlace no encontrado.', 'error')
    except Exception as e:
        print(f"Error al recuperar el enlace: {e}")
        flash('Error al recuperar los detalles del enlace.', 'error')
    
    return redirect(url_for('index'))

@app.route('/enviar_user_data', methods=['POST'])
def enviar_user_data():
    short_link = request.form['short_link']
    username_doc = db.collection('short_links').document(short_link)
    user_doc = username_doc.get()

    if user_doc.exists:
        # Si el documento existe, obtener el campo 'username'
        username = user_doc.to_dict().get('username')
    
        long_link = request.form['long_link']

        click_info = {
            'navegador': request.form['navegador'],
            'version_navegador': request.form['version_navegador'],
            'sistema_operativo': request.form['sistema_operativo'],
            'version_sistema_operativo': request.form['version_sistema_operativo'],
            'es_pc': request.form['es_pc'],
            'es_movil': request.form['es_movil'],
            'es_tablet': request.form['es_tablet'],
            'es_touch_capable': request.form['es_touch_capable'],
            'es_bot': request.form['es_bot'],
            'ip': request.form['ip'],
            'is_eu': request.form['is_eu'],
            'city': request.form['city'],
            'region': request.form['region'],
            'region_code': request.form['region_code'],
            'region_type': request.form['region_type'],
            'country_name': request.form['country_name'],
            'country_code': request.form['country_code'],
            'continent_name': request.form['continent_name'],
            'continent_code': request.form['continent_code'],
            'latitude': request.form['latitude'],
            'longitude': request.form['longitude'],
            'postal': request.form['postal'],
            'calling_code': request.form['calling_code'],
            'flag': request.form['flag'],
            'emoji_flag': request.form['emoji_flag'],
            'emoji_unicode': request.form['emoji_unicode'],
            'asn': request.form['asn'],
            'asn_name': request.form['asn_name'],
            'asn_domain': request.form['asn_domain'],
            'asn_route': request.form['asn_route'],
            'language_name': request.form['language_name'],
            'language_native': request.form['language_native'],
            'language_code': request.form['language_code'],
            'currency_name': request.form['currency_name'],
            'currency_code': request.form['currency_code'],
            'currency_symbol': request.form['currency_symbol'],
            'currency_native': request.form['currency_native'],
            'currency_plural': request.form['currency_plural'],
            'time_zone_name': request.form['time_zone_name'],
            'time_zone_abbr': request.form['time_zone_abbr'],
            'time_zone_offset': request.form['time_zone_offset'],
            'time_zone_is_dst': request.form['time_zone_is_dst'],
            'time_zone_current_time': request.form['time_zone_current_time'],
            'is_tor': request.form['is_tor'],
            'is_icloud_relay': request.form['is_icloud_relay'],
            'is_proxy': request.form['is_proxy'],
            'is_datacenter': request.form['is_datacenter'],
            'is_anonymous': request.form['is_anonymous'],
            'is_known_attacker': request.form['is_known_attacker'],
            'is_known_abuser': request.form['is_known_abuser'],
            'is_bogon': request.form['is_bogon'],
            'es_pc': request.form['es_pc'],
            'es_movil': request.form['es_movil'],
            'es_tablet': request.form['es_tablet'],
            'es_touch_capable': request.form['es_touch_capable'],
            'es_bot': request.form['es_bot'],
            'referer': request.form['referer'],
        }

        # Obtener el documento del usuario en la colección existente
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])

            # Encontrar el enlace correcto y añadir la info de click
            for link in links:
                if link['short_link'] == short_link:
                    if 'clicks' in link:
                        link['clicks'].append(click_info)
                    else:
                        link['clicks'] = [click_info]
                    break
            else:
                flash('Enlace no encontrado.', 'error')
                return redirect(url_for('alguna_pagina_error'))

            # Actualizar el documento del usuario con los enlaces modificados
            user_doc_ref.update({'links': links})

            # Manejar la colección 'dinero' para el saldo
            dinero_doc_ref = db.collection('dinero').document(username)
            dinero_doc = dinero_doc_ref.get()
            if dinero_doc.exists:
                dinero_data = dinero_doc.to_dict()
                saldo_actual = dinero_data.get('saldo', 0)
                dinero_doc_ref.update({'saldo': saldo_actual + 1})
            else:
                dinero_doc_ref.set({'saldo': 1})

        else:
            flash('Usuario no encontrado.', 'error')
            return redirect(url_for('alguna_pagina_error'))
    else:
        # Si el documento no existe, manejar el caso adecuadamente
        return "Short link no encontrado", 404
    # Redirigir al usuario al enlace largo
    return redirect(long_link)

@app.route('/search')
@login_required
@check_user_exists
def search():
    username = session.get('username')
    query = request.args.get('q')

    # Verificar si se proporcionó una consulta de búsqueda
    if not query:
        flash('Por favor, proporciona un término de búsqueda.', 'error')
        return redirect(url_for('panel_page'))

    try:
        user_doc_ref = db.collection('usuarios').document(username)
        user_doc = user_doc_ref.get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            links = user_data.get('links', [])

            # Buscar coincidencias en el título y el enlace largo
            matching_links = []
            for link in links:
                if query.lower() in link.get('title', '').lower() or query.lower() in link.get('long_link', '').lower():
                    matching_links.append(link)

            return render_template('routes/search.html', query=query, links=matching_links)
        else:
            flash('Usuario no encontrado.', 'error')
    except Exception as e:
        print(f"Error al buscar enlaces: {e}")
        flash('Error al buscar enlaces.', 'error')

    return redirect(url_for('panel_page'))

@app.route('/change_password', methods=['POST'])
@login_required
def change_password():
    username = session['username']
    current_password = request.form['current_password']
    new_password = request.form['new_password']

    # Buscar el usuario en Firestore
    user_doc_ref = db.collection('usuarios').document(username)
    user_doc = user_doc_ref.get()
    if user_doc.exists:
        user_data = user_doc.to_dict()
        # Verificar si la contraseña actual es correcta
        if user_data['password'] == current_password:
            # Actualizar la contraseña en Firestore
            user_doc_ref.update({'password': new_password})
            flash('Contraseña actualizada correctamente.')
            return redirect(url_for('logout'))
        else:
            flash('Contraseña actual incorrecta.')
    else:
        flash('Usuario no encontrado.')
    
    return redirect(url_for('ajustes_page'))

def send_email(recipient, subject, body):
    email_sender = 'correoscumbre@gmail.com'
    email_alias = "soporte@cumbre.icu"
    smtp_password = 'vmqc lkje krvi zrre'

    em = EmailMessage()
    em['From'] = email_alias
    em['To'] = recipient
    em['Subject'] = subject
    em.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(email_sender, smtp_password)
        smtp.send_message(em)

    return

@app.route('/send_verification_code', methods=['POST'])
def send_verification_code():
    if 'email' not in session:
        flash('Debes iniciar sesión para realizar esta acción.', 'error')
        return redirect(url_for('login_page'))

    input_email = request.form['email_confirmation']
    if input_email != session['email']:
        flash('El correo electrónico proporcionado no coincide con el registrado.', 'error')
        return redirect(url_for('ajustes_page'))

    verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    session['verification_code'] = verification_code
    session['email_sent_time'] = datetime.utcnow().isoformat()  # Almacenar el tiempo de envío

    subject = "Código de Verificación"
    body = f"Tu código de verificación es: {verification_code}"
    send_email(session['email'], subject, body)

    flash('Se ha enviado un código de verificación a tu correo electrónico.', 'success')
    return redirect(url_for('confirm_verification_code'))
    
@app.route('/confirm_verification_code', methods=['GET', 'POST'])
def confirm_verification_code():
    if 'verification_code' not in session or 'email_sent_time' not in session:
        flash('No se inició el proceso de verificación.', 'error')
        return redirect(url_for('login_page'))

    time_sent = datetime.fromisoformat(session['email_sent_time'])
    if datetime.utcnow() - time_sent > timedelta(minutes=2):
        flash('Código de verificación expirado.', 'error')
        return redirect(url_for('send_verification_code'))

    if request.method == 'POST':
        user_code = request.form['verification_code']
        if user_code == session['verification_code']:
            username = session['username']
            db.collection('usuarios').document(username).update({'links': []})
            flash('Todos los enlaces han sido eliminados.', 'success')
            session.pop('verification_code', None)
        else:
            flash('Código incorrecto. Inténtalo de nuevo.', 'error')

    return render_template('confirm_verification_code.html')

@app.route('/delete_account_request', methods=['POST'])
def delete_account_request():
    if 'username' not in session:
        flash('Debes iniciar sesión para realizar esta acción.', 'error')
        return redirect(url_for('login_page'))

    input_email = request.form['email_confirmation']
    input_password = request.form['password_confirmation']
    user_doc = db.collection('usuarios').document(session['username']).get()
    if user_doc.exists:
        user_data = user_doc.to_dict()
        if user_data['email'] == input_email and user_data['password'] == input_password:
            verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            session['verification_code'] = verification_code
            session['email_sent_time'] = datetime.utcnow().isoformat()  # Almacenar el tiempo de envío

            subject = "Código de Verificación para Eliminar Cuenta"
            body = f"Tu código de verificación para eliminar la cuenta es: {verification_code}"
            send_email(input_email, subject, body)

            flash('Se ha enviado un código de verificación a tu correo electrónico.', 'success')
            return redirect(url_for('confirm_delete_account'))
        else:
            flash('Correo electrónico o contraseña incorrecta.', 'error')
            return redirect(url_for('ajustes_page'))
    else:
        flash('Usuario no encontrado.', 'error')
        return redirect(url_for('ajustes_page'))

    return redirect(url_for('delete_account_page'))

@app.route('/confirm_delete_account', methods=['GET', 'POST'])
def confirm_delete_account():
    if 'verification_code' not in session or 'email_sent_time' not in session:
        flash('No se inició el proceso de verificación.', 'error')
        return redirect(url_for('login_page'))

    time_sent = datetime.fromisoformat(session['email_sent_time'])
    if datetime.utcnow() - time_sent > timedelta(minutes=2):
        flash('Código de verificación expirado.', 'error')
        return redirect(url_for('delete_account_request'))

    if request.method == 'POST':
        user_code = request.form['verification_code']
        if user_code == session['verification_code']:
            db.collection('usuarios').document(session['username']).delete()
            session.clear()
            flash('Tu cuenta ha sido eliminada.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Código incorrecto. Inténtalo de nuevo.', 'error')

    return render_template('confirm_delete_account.html')
    
if __name__ == '__main__':
    app.run(debug=True)
