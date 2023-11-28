from datetime import datetime,timedelta
from urllib import response
from flask import Blueprint, jsonify, request,Response, blueprints
from flask_cors import CORS
from itsdangerous import TimedSerializer
from sqlalchemy import FetchedValue, true
import apiDB

apiDelegaciones=Blueprint('apiDelegaciones',__name__)

###################################################################################
#                DEVUELVE TODAS LAS DELEGACIONES
###################################################################################

@apiDelegaciones.route('/getAll', methods=['post'],strict_slashes=False)
def getAll():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    delegaciones=apiDB.consultaSelect("Select * from delegaciones where deleted is null")

    resultado=jsonify({"success":"ok",'message': "","data":delegaciones})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado



@apiDelegaciones.route('/getById', methods=['post'],strict_slashes=False)
def getById():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    try:
        id_delegacion=request.json.get("data")["id"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    personas=apiDB.consultaSelect("Select * from delegaciones where id=%s",[id_delegacion])


    resultado=jsonify({"success":"ok",'message': "","data":personas})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado
    
@apiDelegaciones.route('/delete', methods=['post'],strict_slashes=False)
def delete():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    try:
        id_delegacion=request.json.get("data")["id"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    apiDB.consultaGuardar("update delegaciones set deleted=current_timestamp where id=%s",[id_delegacion])


    resultado=jsonify({"success":"ok",'message': "Deleg. eliminada correctamente","data":''})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado

@apiDelegaciones.route('/update', methods=['post'],strict_slashes=False)
def update():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    try:
        id_delegacion=request.json.get("data")["id"]
        nombre=request.json.get("data")["nombre"]
        descripcion=request.json.get("data")["descripcion"]
        direccion=request.json.get("data")["direccion"]
        localidad=request.json.get("data")["localidad"]
        telefono=request.json.get("data")["telefono"]
        email=request.json.get("data")["email"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    apiDB.consultaGuardar("update delegaciones set  nombre=%s,descripcion=%s,direccion=%s,localidad=%s,telefono=%s,email=%s where id=%s",
    [nombre,descripcion,direccion,localidad,telefono,email, id_delegacion])


    resultado=jsonify({"success":"ok",'message': "Deleg. modificada correctamente","data":''})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado
    

@apiDelegaciones.route('/new', methods=['post'],strict_slashes=False)
def new():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    try:
        nombre=request.json.get("data")["nombre"]
        descripcion=request.json.get("data")["descripcion"]
        direccion=request.json.get("data")["direccion"]
        localidad=request.json.get("data")["localidad"]
        telefono=request.json.get("data")["telefono"]
        email=request.json.get("data")["email"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado


    apiDB.consultaGuardar("insert into delegaciones (nombre,descripcion,direccion,localidad,telefono,email) values (%s,%s,%s,%s,%s,%s)",
    [nombre,descripcion,direccion,localidad,telefono,email])


    resultado=jsonify({"success":"ok",'message': "Deleg. guardada correctamente","data":''})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado
    