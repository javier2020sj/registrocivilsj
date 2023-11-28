from datetime import datetime,timedelta
from urllib import response
from flask import Blueprint, jsonify, request,Response, blueprints
from flask_cors import CORS
from itsdangerous import TimedSerializer
from sqlalchemy import FetchedValue, true
import apiDB

apiFeriados=Blueprint('apiFeriados',__name__)

###################################################################################
#                DATOS DE USUARIOS
###################################################################################

@apiFeriados.route('/getAll', methods=['post'],strict_slashes=False)
def getAll():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    usuarios=apiDB.consultaSelect("Select * from users where deleted is null limit 1000")
    resultado=jsonify({"success":"ok",'message': "","data":usuarios})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado



@apiFeriados.route('/new', methods=['post'],strict_slashes=False)
def new():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        
        nombre=request.json.get("data")["nombre"]
        apellido=request.json.get("data")["apellido"]
        password=request.json.get("data")["password"]
        username=request.json.get("data")["username"]
        admin=request.json.get("data")["admin"]

    except:
        resultado=jsonify({"success":"fail",'message': "No se enviaron los datos correctamente"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
    # Verifico que el usuario no exista
    existente=apiDB.consultaSelect("Select id from users where username=%s",[username])
    if(len(existente)>0):
        resultado=jsonify({"success":"fail",'message': "El nombre de usuario ya existe","data":{"id":existente}})
        resultado.headers.add('Access-Control-Allow-Origin', '*')  
        return resultado

    apiDB.consultaGuardar("INSERT INTO `registrocivil`.`users` (`name`, `lastname`, `password`,`username`,`admin`) VALUES (%s,%s,%s,%s,%s);",
    [nombre,apellido,password,username,admin])
    lastiId=apiDB.consultaSelect("Select max(id) as id from users")

    resultado=jsonify({"success":"ok",'message': "Nuevo usuario guardado correctamente","data":{"id":lastiId}})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado


@apiFeriados.route('/update', methods=['post'],strict_slashes=False)
def update():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        userid=request.json.get("data")["id"]
        nombre=request.json.get("data")["nombre"]
        apellido=request.json.get("data")["apellido"]
        password=request.json.get("data")["password"]
        username=request.json.get("data")["username"]
        admin=request.json.get("data")["admin"]

    except:
        resultado=jsonify({"success":"fail",'message': "No se enviaron los datos correctamente"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    apiDB.consultaGuardar("update users set name=%s, lastname=%s, password=%s,username=%s,admin=%s where id=%s",
    [nombre,apellido,password,username,admin,userid])

    resultado=jsonify({"success":"ok",'message': "Nuevo usuario guardado correctamente","data":{"id":userid}})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado

@apiFeriados.route('/delete', methods=['post'],strict_slashes=False)
def delete():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        userid=request.json.get("data")["id"]

    except:
        resultado=jsonify({"success":"fail",'message': "No se enviaron los datos correctamente"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    apiDB.consultaGuardar("update users set deleted=CURRENT_TIMESTAMP() where id=%s",
    [userid])

    resultado=jsonify({"success":"ok",'message': "El usuario fue eliminado correctamente","data":{"id":userid}})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado