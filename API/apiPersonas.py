from datetime import datetime,timedelta
from urllib import response
from flask import Blueprint, jsonify, request,Response, blueprints
from flask_cors import CORS
from itsdangerous import TimedSerializer
from sqlalchemy import FetchedValue, true
import apiDB

apiPersonas=Blueprint('apiPersonas',__name__)

###################################################################################
#                DEVUELVE TODAS LAS ESCOLARIDADES
###################################################################################

@apiPersonas.route('/getAll', methods=['post'],strict_slashes=False)
def getAll():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    personas=apiDB.consultaSelect("Select * from personas limit 1000")
    resultado=jsonify({"success":"ok",'message': "","data":personas})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado

@apiPersonas.route('/getByDni', methods=['post'],strict_slashes=False)
def getByDni():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        dni_persona=request.json.get("data")["dni"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    personas=apiDB.consultaSelect("Select * from personas where dni=%s order by id desc limit 1",[dni_persona])

    if (len(personas) >0):
        resultado=jsonify({"success":"ok",'message': "datos obtenidos correctamente","data":personas})
    else:
        resultado=jsonify({"success":"ok",'message': "dni no encontrado en la base de datos","data":personas})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado


@apiPersonas.route('/getByName', methods=['post'],strict_slashes=False)
def getByName():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        nombre=request.json.get("data")["nombre"]
    except:
        resultado=jsonify({"success":"fail",'message': "no envió el campo a buscar"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        limite=request.json.get("data")["limite"]
        offset=request.json.get("data")["offset"]
    except:
        limite=10
        offset=0

    personas=apiDB.consultaSelect("Select * from personas where nombre like '%" + nombre+ "%' or apellido like '%" + nombre+ "%' limit " + str(limite) + " offset " + str(offset))


    resultado=jsonify({"success":"ok",'message': "","data":personas})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado





@apiPersonas.route('/update', methods=['post'],strict_slashes=False)
def update():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        id=request.json.get("data")["codigo"]
        
        nombre=request.json.get("data")["nombre"]
        apellido=request.json.get("data")["apellido"]
        fechaNac=request.json.get("data")["fechaNac"]
        sexo=request.json.get("data")["sexo"]
        direccion=request.json.get("data")["direccion"]
        localidad=request.json.get("data")["localidad"]
        telefono=request.json.get("data")["telefono"]
        celular=request.json.get("data")["celular"]
        email=request.json.get("data")["email"]
        print(nombre)
        print(apellido)
        print(fechaNac)
        print(sexo)
        print(direccion)
        print(localidad)
        print(telefono)
        print(celular)
        print(email)

    except:
        resultado=jsonify({"success":"fail",'message': "No se enviaron los datos correctamente"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
    query="UPDATE registrocivil.personas SET nombre = '"+nombre+"',apellido = '"+apellido+"',sexo = '"+sexo+"',domicilio = '"+direccion+"',departamento = '"+str(localidad)+"',fecha_nac = '"+str(fechaNac)+"',tel = '"+telefono+"',tel2 = '"+celular+"',email = '"+email+"' WHERE id = '"+str(id)+"';"
    print(query)

    personas=apiDB.consultaGuardar("UPDATE registrocivil.personas SET nombre = %s,apellido = %s,sexo = %s,domicilio = %s,departamento = %s,fecha_nac = %s,tel = %s,tel2 = %s,email = %s WHERE id = %s;",
    [nombre,apellido,sexo,direccion,localidad,fechaNac,telefono,celular,email,id])

    resultado=jsonify({"success":"ok",'message': "Datos guardados correctamente","data":personas})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado


@apiPersonas.route('/new', methods=['post'],strict_slashes=False)
def new():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    try:
        
        nombre=request.json.get("data")["nombre"]
        apellido=request.json.get("data")["apellido"]
        fechaNac=request.json.get("data")["fechaNac"]
        sexo=request.json.get("data")["sexo"]
        direccion=request.json.get("data")["direccion"]
        localidad=request.json.get("data")["localidad"]
        telefono=request.json.get("data")["telefono"]
        celular=request.json.get("data")["celular"]
        email=request.json.get("data")["email"]
        dni=request.json.get("data")["dni"]

    except:
        resultado=jsonify({"success":"fail",'message': "No se enviaron los datos correctamente"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    apiDB.consultaGuardar("INSERT INTO `registrocivil`.`personas` (`nombre`, `apellido`, `sexo`,`dni`,`domicilio`,`departamento`,`fecha_nac`,`tel`,`tel2`,`email`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);",
    [nombre,apellido,sexo,dni,direccion,localidad,fechaNac,telefono,celular,email])
    lastiId=apiDB.consultaSelect("Select max(id) as id from personas")

    resultado=jsonify({"success":"ok",'message': "Nueva persona guardada correctamente","data":lastiId})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado