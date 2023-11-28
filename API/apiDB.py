import io
import string
import secrets
import os
import mysql.connector
##################################################
###DATOS DEL SERVIDOR DE BASE DE DATOS
################################################


server_host="127.0.0.1"
server_user="root"
server_passwd='1qa2ws3ed'
server_db='registrocivil'
server_port=3306


###################################################################################
#              GENERA UN TOKEN UNICO PARA EL USUARIO QUE HACE LOGIN
###################################################################################
def tokengen():
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(100))
    return password


###################################################################################
#              COMPRUEBA TOKEN
###################################################################################

def comprueba_token(request):
    try:
        if 'token' not in request.json:
            return False
    except:
            return False
    
    token=request.json.get('token', "")

    if token != "":
        resultado=consultaSelect("Select * from users where token='"+token+"'")
        if (len(resultado))==0:
            return False
        else:
            return True
    #------------------------------------------------------------------------------------------

###################################################################################
#              COMPRUEBA TOKEN
###################################################################################

def user_id(request):
    try:
        if 'token' not in request.json:
            return False
    except:
            return False
    
    token=request.json.get('token', "")

    if token != "":
        resultado=consultaSelect("Select * from users where token='"+token+"'")
        if (len(resultado))==0:
            return False
        else:
            print(resultado)
            return resultado[0]['id']
            
    #------------------------------------------------------------------------------------------


###################################################################################
#                     CONSULTA A LA DB Y DEVUELVE VALORES
###################################################################################
def consultaSelect(query,args=None):
    db = mysql.connector.connect(host=str(server_host),
                             user=str(server_user),
                             passwd=str(server_passwd),
                             db=str(server_db),
                             port=str(server_port))

    cursor = db.cursor(dictionary=True)


    cursor.execute(query,args)

    result=cursor.fetchall()
    
    return result


###################################################################################
#                CONSULTA A DB PARA INSERCION O ACTUALIZACION
###################################################################################
def consultaGuardar(query,args=None):
    print(query)
    db = mysql.connector.connect(host=server_host,
                             user=server_user,
                             passwd=server_passwd,
                             db=server_db,
                             port=server_port)
    
    cursor = db.cursor(dictionary=True)

    cursor.execute(query,args)
    db.commit()
    db.close()
