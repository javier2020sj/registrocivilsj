import io
import os
import apiDB
import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

from flask import send_file

from werkzeug.utils import secure_filename
from apiAgenda import apiAgenda
from apiPersonas import apiPersonas
from apiDelegaciones import apiDelegaciones
from apiUsuarios import apiUsuarios
from apiFeriados import apiFeriados
from apiTiposTramites import apiTiposTramites
from apiLocaciones import apiLocaciones

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
  
UPLOAD_FOLDER = '/home/javier'
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


app = Flask(__name__)

app.register_blueprint(apiAgenda, url_prefix='/agenda')
app.register_blueprint(apiPersonas, url_prefix='/personas')
app.register_blueprint(apiDelegaciones, url_prefix='/delegaciones')
app.register_blueprint(apiUsuarios, url_prefix='/usuarios')
app.register_blueprint(apiFeriados, url_prefix='/feriados')
app.register_blueprint(apiTiposTramites, url_prefix='/tipostramites')
app.register_blueprint(apiLocaciones, url_prefix='/locaciones')
app.config['CORS_HEADERS'] = 'Content-Type'


CORS(app)

###################################################################################
#                               prueba retorno
###################################################################################
@app.route('/', methods=['get'])
def test():
    db = mysql.connector.connect(host=str(apiDB.server_host),
                             user=str(apiDB.server_user),
                             passwd=str(apiDB.server_passwd),
                             db=str(apiDB.server_db),
                             port=str(apiDB.server_port))


    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT VERSION();")

    result=cursor.fetchone()
    return jsonify(result)


###################################################################################
#                               COMPRUEBA TOKEN
###################################################################################
@app.route('/token', methods=['POST'])
def token():
    #Compruebo token---------------------------------------------------------------------------
    print(request is None)
    try:
        if 'token' not in request.json:
            return jsonify({"success":"fail",'message': "not loged user"}), 200
    except:
            return jsonify({"success":"fail",'message': "not loged user"}), 200
    
    token=request.json.get('token', "")

    if token != "":
        resultado=apiDB.consultaSelect("Select * from users where token='"+token+"'")
        if (len(resultado))==0:
            return jsonify({"success":"fail",'message': "loged user"}), 200
        else:
            return jsonify({"success":"ok",'message': "loged user"}), 200
    #------------------------------------------------------------------------------------------

###################################################################################
#                 LOGIN DE USUARIO (DEVUELVE TOKEN SI ES CORRECTO)
###################################################################################
@app.route('/login', methods=['POST'])
def login():
    try:

        usrname=request.json.get("data")['username']
        
        password=request.json.get("data")['password']    
    except:
        resultado=jsonify({"success":"fail",'message': "no envió usrname o pasword"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    #cursor = db.cursor(dictionary=True)
    query='''SELECT * from users where username = %s and password= %s'''
    #cursor.execute(query,(usrname,password))
    result=apiDB.consultaSelect(query,(usrname,password)) #cursor.fetchall()
    if (len(result)) > 0:
        nuevotoken=apiDB.tokengen()
        texto={"success":"ok","admin":result[0]['admin'],"id":result[0]['id'],"token":nuevotoken,"name":result[0]['name']}
        #cursor = db.cursor(dictionary=True)
        query="update users set token=%s,last_login=NOW() where id=%s"
        #cursor.execute(query,(nuevotoken,result[0]['id']))
        #db.commit()
        
        apiDB.consultaGuardar(query,(nuevotoken,str(result[0]['id'])))
        response=jsonify(texto)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response,201
    else:
        return jsonify({'success': "fail"}), 200


if __name__ == '__main__':
   app.run(host='0.0.0.0',debug=True,port=5000)