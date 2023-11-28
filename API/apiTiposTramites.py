from datetime import datetime,timedelta
from urllib import response
from flask import Blueprint, jsonify, request,Response, blueprints
from flask_cors import CORS
from itsdangerous import TimedSerializer
from sqlalchemy import FetchedValue, true
import apiDB

apiTiposTramites=Blueprint('apiTiposTramites',__name__)

###################################################################################
#                DEVUELVE TODAS LAS DELEGACIONES
###################################################################################

@apiTiposTramites.route('/getAll', methods=['post'],strict_slashes=False)
def getAll():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    tramites=apiDB.consultaSelect("Select * from tipo_tramite order by tipo_tramite")

    resultado=jsonify({"success":"ok",'message': "","data":tramites})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado

@apiTiposTramites.route('/getById', methods=['post'],strict_slashes=False)
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
    

