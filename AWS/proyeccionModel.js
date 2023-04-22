module.exports = class Proyeccion {
    constructor (
        cripto,
        fecha,
        precio,
        forecast,
        pesimista,
        optimista,
        idGrupo
    ) {
        this.cripto = cripto;
        this.fecha = fecha;
        this.precio = precio;
        this.forecast = forecast;
        this.pesimista = pesimista;
        this.optimista = optimista;
        this.idGrupo = idGrupo
    }
    push(proyeccionescp) {
        proyeccionescp.push({
            cripto: this.cripto,
            fecha: this.fecha,
            precio: this.precio,
            forecast: this.forecast,
            pesimista: this.pesimista,
            optimista: this.optimista,
            id_grupo: this.idGrupo
        });
    }
}