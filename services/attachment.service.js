const odooQuery = require('../helper/odoo.query');
const fs = require('fs');

exports.createAttachment = async (credentials, model, model_id, attachment) => {
    try {
        //Credenciales
        const { db, uid, password } = credentials;

        //Crear el archivo
        const fileBuffer = fs.readFileSync(attachment.path);
        const base64File = fileBuffer.toString('base64');

        //Crear la informacion del adjunto
        const attachmentData = {
            name: attachment.originalname,
            datas: base64File,
            res_model: model,
            res_id: model_id,
            mimetype: attachment.mimetype,
            type: 'binary',
        };

        //Agregar el adjunto
        const response = await odooQuery.query(
            'object',
            'execute_kw',
            [db, uid, password, 'ir.attachment', 'create', [attachmentData]]
        );
        let res = {};

        if (response.success === false && response.error === true) {
            //Error interno de odoo
            res = { statusCode: 500, message: "Error interno.", data: [response.data] };
        } else if (response.success === false || response.data === false) {
            //Error guardando el adjunto
            res = { statusCode: 400, message: "Error en la creacion del adjunto.", data: [response.data] };
        } else {
            res = { statusCode: 200, message: "Adjunto agregado exitosamente.", data: response.data };
        }

        return res;
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e] }
    }
}

exports.deleteAttachment = async (credentials, attachment_id) => {
    try {
        //Credenciales
        const { db, uid, password } = credentials;

        const id = Number(attachment_id)
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${attachment_id}' no es un id de adjunto valido.`, data: [] }
        }

        //Verificar si el adjunto existe
        const attachment = await this.getAttachmentById(credentials, id);
         if (!attachment || attachment.data.length === 0) return { statusCode: 404, message: `El adjunto con id '${id}' no existe`, data: [] };

        //Eliminar el adjunto
        const response = await odooQuery.query(
            'object',
            'execute_kw',
            [db, uid, password, 'ir.attachment', 'unlink', [[id]]]
        );
        let res = {};

        if (response.success === false && response.error === true) {
            //Error interno de odoo
            res = { statusCode: 500, message: "Error interno.", data: [response.data] };
        }  else {
            res = { statusCode: 200, message: "Adjunto eliminado exitosamente.", data: response.data };
        }

        return res;
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e] }
    }
}

exports.getAttachment = async (credentials, filters = []) => {
    try {
        //Credenciales
        const { db, uid, password } = credentials;
        //Eliminar el adjunto
        const response = await odooQuery.query(
            'object',
            'execute_kw',
            [db, uid, password, 'ir.attachment', 'search_read', [filters], { fields: ['id', 'name', 'mimetype', 'res_model', 'res_id'] }]

        );
        let res = {};

        if (response.success === false && response.error === true) {
            //Error interno de odoo
            res = { statusCode: 500, message: "Error interno.", data: [response.data] };
        } else if (response.success === false || response.data === false) {
            //Error guardando el adjunto
            res = { statusCode: 400, message: "Error en la obtencion del adjunto.", data: [response.data] };
        } else {
            res = { statusCode: 200, message: "Adjuntos obtenidos.", data: response.data };
        }

        return res;
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e] }
    }

}

exports.getAttachmentById = async (credentials, attachment_id) => {
    try {

        //Verificar si es un id valido
        const id = Number(attachment_id)
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${attachment_id}' no es un id de adjunto valido.`, data: [] }
        }

        //Buscar el adjunto
        const response = await this.getAttachment(credentials, [["id", "=", id]])
        let res = {};
        if (response.success === false && response.error === true) {
            //Error interno de odoo
            res = { statusCode: 500, message: "Error interno.", data: [response.data] };
        } else if (response.success === false || response.data === false) {
            //Error obteniedno el adjunto
            res = { statusCode: 400, message: "Error en la obtencion del adjunto.", data: [response.data] };
        } else if (!response || response.data.length === 0) {
            //Adjunto no existe
            return { statusCode: 404, message: `El adjunto con id '${attachment_id}' no existe`, data: [] }
        }else {
            res = { statusCode: 200, message: "Adjuntos obtneidos.", data: response.data };
        }

        return res;
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e] }
    }

}