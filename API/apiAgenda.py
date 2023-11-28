from datetime import datetime,timedelta,date
from urllib import response
from flask import Blueprint, jsonify, request,Response, blueprints
from flask_cors import CORS
from itsdangerous import TimedSerializer
from sqlalchemy import FetchedValue, false, true
import apiDB

apiAgenda=Blueprint('apiAgenda',__name__)

###################################################################################
#                DEVUELVE TODAS LAS ESCOLARIDADES
###################################################################################

@apiAgenda.route('/', methods=['post'],strict_slashes=False)
def root():
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    resultado=jsonify({"success":"ok",'message': "Api de agenda"})
    resultado.headers.add('Access-Control-Allow-Origin', '*')
    return resultado

###################################################################################
#                DEVUELVE TODOS LOS DATOS DE LOS TURNOS
###################################################################################

@apiAgenda.route('/getAll', methods=['post'],strict_slashes=False)
def getAll():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado

    query="""select a.id,a.fechaInicio,a.fechaFin,a.delegacion_id,d.nombre as delegacion,a.distancia,a.cantidad,pause_status,user_id,u.username
from agenda a
inner join delegaciones d on d.id=a.delegacion_id
left join users u on u.id = a.user_id
order by d.nombre,a.fechaInicio"""
    agendas=apiDB.consultaSelect(query,[])
    return jsonify({"success":"ok",'qty':len(agendas), "message":"" if len(agendas)>0 else "Sin turnos","data":agendas}), 200


###################################################################################
#                CAMBIA EL ESTADO DE PAUSA DE LOS AGENDAS
###################################################################################

@apiAgenda.route('/changepausestatus', methods=['post'],strict_slashes=False)
def changepausestatus():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
    id_agenda =int(request.json.get("data")["idAgenda"])    
    status =int(request.json.get("data")["status"])


    query="""update agenda set pause_status = %s where id=%s"""
    apiDB.consultaGuardar(query,[status,id_agenda])
    return jsonify({"success":"ok", "message":"La agenda fue modificada correctamente","data":""}), 200

###################################################################################
#               GENERA NUEVA AGENA
###################################################################################


@apiAgenda.route('/generate', methods=['post'],strict_slashes=False)
def scheduleGenerate():

    # comprueba si el token es correcto
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
        
    # Obtengo los datos desde el request
    idUsuario=apiDB.user_id(request)
    delegacion_id=request.json.get("data")["delegacion_id"]
    horaInicio=datetime.strptime(request.json.get("data")["horaInicio"],"""%H:%M""")
    fechaInicio=datetime.strptime(request.json.get("data")["fechaInicio"] + " " + request.json.get("data")["horaInicio"],"""%Y-%m-%d %H:%M""")
    fechaFin=datetime.strptime(request.json.get("data")["fechaFin"] + " " + request.json.get("data")["horaInicio"],"""%Y-%m-%d %H:%M""")
    distancia=int(request.json.get("data")["distancia"])
    cantidad=int(request.json.get("data")["cantTurnos"])
    puestos=int(request.json.get("data")["puestos"])

    # Verifico que la distancia entre fechas no sea mayor a una semana
    cantidadDias=((fechaFin - fechaInicio).days+1)
    print(cantidadDias)
    if (cantidadDias>7):
        return jsonify({"success":"fail",'message': "Cantidad de días es superior a una semana"}), 200

    # verifico que no se superpongan turnos
    query="""select count(at2.id) as cant
            from agenda_turnos at2 
            inner join agenda a 
                on a.id = at2.agenda_id 
            where datetime between %s and %s
            AND 
            a.delegacion_id =%s"""
    turnoExist=apiDB.consultaSelect(query,[fechaInicio,fechaFin,delegacion_id])[0]["cant"]
    print(turnoExist)
    if(turnoExist>0):
        return jsonify({"success":"fail",'message': "Hay turnos que se superponen de la misma delegacion, los datos no se guardaron."}), 200


    # Verifico que la agenta no sea anterior a hoy
    if(datetime.now() > fechaInicio):
        return jsonify({"success":"fail",'message': "La agenda que pretende generar es anterior al dia de hoy"}), 200


    # Genero los datos de agenda
    query="insert into agenda (fechaInicio,fechaFin,horaInicio,delegacion_id,distancia,cantidad,user_id) values (%s,%s,%s,%s,%s,%s,%s);"
    apiDB.consultaGuardar(query,[fechaInicio,fechaFin,horaInicio,delegacion_id,distancia,cantidad, idUsuario])
    query="Select max(id) as ultimo from agenda"
    ultimoId=apiDB.consultaSelect(query)[0]["ultimo"]


    # Genero arreglo de días
    cantTurnos=0
    fecha=fechaInicio
    while fecha <= fechaFin:
        fechaActual=fecha
        print(fecha)
        for i in range((cantidad)):
            
            print(str(ultimoId) + " - fecha: " + str(fecha))
            query="insert into agenda_turnos (agenda_id,datetime,puestos,turnos_disponibles) values (%s,%s,%s,%s)"
            apiDB.consultaGuardar(query,[ultimoId,fecha,puestos,puestos])
            fecha+= (timedelta(minutes=distancia))
            cantTurnos+=1
        fecha=fechaActual + timedelta(days=1)


    return jsonify({"success":"ok",'message': "Agenda generada correctamente","cantidad":cantTurnos}), 200

###################################################################################
#                CANCELA UN TURNO
###################################################################################


@apiAgenda.route('/cancel', methods=['post'],strict_slashes=False)
def cancel():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
    idTurno=request.json.get("data")["idTurno"]
    idUsuario=apiDB.user_id(request)
    # obtengo los turnos libres
    query="""Select * from agenda_turnos_asignados where id=%s"""
    id_agenda_turno=apiDB.consultaSelect(query,[idTurno])[0]["agenda_turnos_id"]
    query="""update agenda_turnos set turnos_disponibles=turnos_disponibles+1 where id=%s"""
    apiDB.consultaGuardar(query,[id_agenda_turno])
    query="""update agenda_turnos_asignados set canceled_datetime=current_timestamp, canceled_user =%s where id=%s"""
    apiDB.consultaGuardar(query,[idUsuario,idTurno])
    return jsonify({"success":"ok", "message":"Se cancelo el turno" ,"data":''}), 200


###################################################################################
#                DEVUELVE TURNOS LIBRES
###################################################################################


@apiAgenda.route('/getFreeSchedule', methods=['post'],strict_slashes=False)
def scheduleGetFreeDates():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    
    delegacion_id=request.json.get("data")["delegacion_id"]
    fecha=datetime.strptime(request.json.get("data")["fecha"],"""%Y-%m-%d""")
    
    # obtengo los turnos libres
    query="""select 
                date_format(at2.datetime,"%H:%i") as turno,
                a.delegacion_id,
                m.nombre as delegacion,
                at2.id as sch_id,
                at2.enabled
            from agenda_turnos at2 
            inner join agenda a 
                on a.id = at2.agenda_id 
            inner join delegaciones m
                on m.id = a.delegacion_id
            where datetime between %s and %s
            AND
            a.pause_status=0
            AND
            at2.turnos_disponibles > 0
            AND 
            a.delegacion_id =%s"""
    turnos=apiDB.consultaSelect(query,[fecha,fecha+timedelta(days=1),delegacion_id])
    return jsonify({"day":fecha,"success":"ok",'qty':len(turnos), "message":"" if len(turnos)>0 else "Sin turnos","data":turnos}), 200

###################################################################################
#                ASIGNA UN TURNO A UNA PERSONA
###################################################################################

@apiAgenda.route('/asignDate', methods=['post'],strict_slashes=False)
def asignDate():

    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    usuario_id=apiDB.consultaSelect("select id from users where token='"+ request.json.get('token', "")+"'")[0]["id"]
    agenda_id=request.json.get("data")["schedId"]
    persona_id=request.json.get("data")["personaId"]
    tipotramite=int(request.json.get("data")["tipoTramite"])


    # obtengo los turnos libres
    query="""insert into agenda_turnos_asignados (user_id,persona_id,agenda_turnos_id,tipo_tramite_id) values (%s,%s,%s,%s)"""
    apiDB.consultaGuardar(query,[usuario_id,persona_id,agenda_id,tipotramite])
    query="""update agenda_turnos set turnos_disponibles=turnos_disponibles-1 where id=%s"""
    apiDB.consultaGuardar(query,[agenda_id])
    return jsonify({"success":"ok", "message":"Los datos fueron guardados correctamente","data":""}), 200


###################################################################################
#                DEVUELVE LOS TURNOS POR DELEGACION Y FECHAS
###################################################################################

@apiAgenda.route('/getByDeleg', methods=['post'],strict_slashes=False)
def getByDeleg():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    delegacion_id=request.json.get("data")["delegacion_id"]
    try:
        fechaInicio=datetime.strptime(request.json.get("data")["fechaInicio"] ,"""%Y-%m-%d %H:%M:%S""")
    except:
        fechaInicio=None
    try:
        fechaFin=datetime.strptime(request.json.get("data")["fechaFin"] ,"""%Y-%m-%d %H:%M:%S""")
    except:
        fechaFin=None
    datos=[]
    # verifico que no se superpongan turnos
    query="""SELECT u.username,DATE_FORMAT(at.datetime,"%d/%m/%Y %k:%i:%S") as "fechaHora",p.dni,p.apellido,p.nombre, p.tel as tel, p.tel2 as cel, concat(d.nombre,' - ',d.descripcion) as delegacion, tt.tipo_tramite,DATE_FORMAT(ata.create_datetime,"%d/%m/%Y %k:%i:%S") as "fechaCreacion",DATE_FORMAT(ata.canceled_datetime,"%d/%m/%Y %k:%i:%S") as "cancelFecha",cu.username as cancelUsuario
        FROM agenda a 
        inner join agenda_turnos at on a.id = at.agenda_id 
        inner join agenda_turnos_asignados ata on at.id = ata.agenda_turnos_id
        inner join personas p on ata.persona_id=p.id
        inner join delegaciones d on d.id=a.delegacion_id
        inner join users u on u.id=ata.user_id
        left join users cu on cu.id=ata.canceled_user
        inner join tipo_tramite tt on tt.id=ata.tipo_tramite_id
        """
    if(fechaFin!=None and fechaInicio!=None):
        query=query + "where at.datetime between %s and %s"
        datos=[fechaInicio,fechaFin]
    else:
        if(fechaInicio==None and fechaFin!=None):
            query=query + "where at.datetime < %s"
            datos=[fechaFin]
        elif(fechaInicio!=None and fechaFin==None):
            query=query + "where at.datetime > %s"
            datos=[fechaInicio]

    if(delegacion_id!=0 and delegacion_id!='0' and delegacion_id!="0"):
        query=query + " and a.delegacion_id=%s"
        datos.append(delegacion_id)

    turnos=apiDB.consultaSelect(query+ " order by at.datetime asc",datos)
    return jsonify({"success":"ok",'qty':len(turnos), "message":"" ,"data":turnos}), 200


###################################################################################
#                DEVUELVE TURNOS POR DNI POSTERIORES A LA FECHA DE HOY
###################################################################################

@apiAgenda.route('/getByDni', methods=['post'],strict_slashes=False)
def getByDni():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    dni=request.json.get("data")["dni"]
    
    # verifico que no se superpongan turnos
    query="""SELECT ata.id as id, DATE_FORMAT(at.datetime,"%d/%m/%Y %k:%i:%S") as "fechaHora",p.dni,p.apellido,p.nombre, p.tel as tel, p.tel2 as cel, concat(d.nombre,' - ',d.descripcion) as delegacion, tt.tipo_tramite
        FROM agenda a 
        inner join agenda_turnos at on a.id = at.agenda_id 
        inner join agenda_turnos_asignados ata on at.id = ata.agenda_turnos_id
        inner join personas p on ata.persona_id=p.id
        inner join delegaciones d on d.id= a.delegacion_id
        inner join tipo_tramite tt on tt.id=ata.tipo_tramite_id
        where p.dni = %s and at.datetime > current_timestamp() and canceled_datetime is null order by at.datetime asc"""
    turnos=apiDB.consultaSelect(query,[dni])
    return jsonify({"success":"ok",'qty':len(turnos), "message":"" ,"data":turnos}), 200


###################################################################################
#                DEVUELVE TURNOS POR ID DE AGENDA
###################################################################################

@apiAgenda.route('/getById', methods=['post'],strict_slashes=False)
def getById():
    
    pruebaToken=apiDB.comprueba_token(request)
    if(pruebaToken==False):
        resultado=jsonify({"success":"fail",'message': "token incorrecto"})
        resultado.headers.add('Access-Control-Allow-Origin', '*')
        return resultado
    

    id=request.json.get("data")["id"]
    
    # verifico que no se superpongan turnos
    query="""SELECT a.id as cod,ata.id as id, DATE_FORMAT(at.datetime,"%d/%m/%Y %k:%i:%S") as "fechaHora",p.dni,p.apellido,p.nombre, p.tel as tel, p.tel2 as cel, d.nombre as delegacion, tt.tipo_tramite
        FROM agenda a 
        inner join agenda_turnos at on a.id = at.agenda_id 
        inner join agenda_turnos_asignados ata on at.id = ata.agenda_turnos_id
        inner join personas p on ata.persona_id=p.id
        inner join delegaciones d on d.id= a.delegacion_id
        inner join tipo_tramite tt on tt.id=ata.tipo_tramite_id
        where a.id=%s order by at.datetime asc"""
    turnos=apiDB.consultaSelect(query,[id])
    return jsonify({"success":"ok",'qty':len(turnos), "message":"" ,"data":turnos}), 200



###################################################################################
#                REVISA TOKEN
###################################################################################

def token(request):
    #Compruebo token---------------------------------------------------------------------------
    try:
        if 'token' not in request.json:
            return false
    except:
            return false
    
    token=request.json.get('token', "")

    if token != "":
        resultado=apiDB.consultaSelect("Select * from users where token='"+token+"'")
        if (len(resultado))==0:
            return false
        else:
            return true
    #------------------------------------------------------------------------------------------
