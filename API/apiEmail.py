
from email import encoders
from email.mime.base import MIMEBase
import smtplib
import email.utils
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import apiDB

from pymysql import*
import xlwt 
import pandas.io.sql as sql



# connect the mysql with the python
con=connect(user="root",password="1qa2ws3ed",host="localhost",database="registrocivil")
# read the data
df=sql.read_sql("""SELECT d.nombre as Delegacion,DATE_FORMAT(at.datetime, "%d/%m/%Y %H:%i") as "Fecha y hora" ,p.dni as "Nro. Doc",UPPER(concat(p.apellido , ', ' , p.nombre))  as Nombre
        FROM agenda a 
        inner join agenda_turnos at on a.id = at.agenda_id 
        inner join agenda_turnos_asignados ata on at.id = ata.agenda_turnos_id
        inner join personas p on ata.persona_id=p.id
        inner join delegaciones d on d.id=a.delegacion_id
        inner join users u on u.id=ata.user_id
""",con)
# print the data
print(df)
# export the data into the excel sheet
df.to_excel('ds.xls',sheet_name="Turnos")



# Prompt the user for connection info
to_email = "villavicencio.javier@gmail.com"
servername ="ch000086.ferozo.com"
serverport = "465"
if serverport:
    serverport = int(serverport)
else:
    serverport = 25

use_tls = "yes"
username = "soporte@empreminsa.com"
password = "SanJuan22"

# Create the message
msg= MIMEMultipart()
msg.attach(MIMEText("""


<b>Prueba de tabla</b>
<table border=1 cellspacing=0 cellpadding=2>
    <thead>
        <td BGCOLOR="RED">cabecera 1</td>
        <td BGCOLOR="RED">cabecera 2</td>
    </thead>
    <tbody>
        <tr>
            <td>celda 1</td>
            <td>celda 2</td>
        </tr>
    </tbody>
</table>

""",'html'))


msg.set_unixfrom('author')
msg['To'] = email.utils.formataddr(('Recipient', to_email))
msg['From'] = email.utils.formataddr(('Javier',
                                      username))
msg['Subject'] = 'Prueba de envio de mensajes'



filename = "ds.xls"  # In same directory as script

# Open PDF file in binary mode
with open(filename, "rb") as attachment:
    # Add file as application/octet-stream
    # Email client can usually download this automatically as attachment
    part = MIMEBase("application", "octet-stream")
    part.set_payload(attachment.read())

# Encode file in ASCII characters to send by email    
encoders.encode_base64(part)

# Add header as key/value pair to attachment part
part.add_header(
    "Content-Disposition",
    f"attachment; filename= {filename}",
)

msg.attach(part)

if use_tls == 'yes':
    print('starting with a secure connection')
    server = smtplib.SMTP_SSL(servername, serverport)
else:
    print('starting with an insecure connection')
    server = smtplib.SMTP(servername, serverport)
try:
    server.set_debuglevel(True)

    # identify ourselves, prompting server for supported features
    server.ehlo()

    # If we can encrypt this session, do it
    if server.has_extn('STARTTLS'):
        print('(starting TLS)')
        server.starttls()
        server.ehlo()  # reidentify ourselves over TLS connection
    else:
        print('(no STARTTLS)')

    if server.has_extn('AUTH'):
        print('(logging in)')
        server.login(username, password)
    else:
        print('(no AUTH)')

    server.sendmail(username,
                    [to_email],
                    msg.as_string())
finally:
    server.quit()