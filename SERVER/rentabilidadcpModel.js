module.exports = class RentabilidadCP {
    constructor (
        secuencial,
        escenario,
        cripto,
        h24,
        h48,
        d5,
        idGrupo
    ) {
        this.secuencial = secuencial;
        this.escenario = escenario;
        this.cripto = cripto;
        this.h24 = h24;
        this.h48 = h48;
        this.d5 = d5;
        this.idGrupo = idGrupo
    }
    push(proyeccionescp) {
        proyeccionescp.push({
            secuencial: this.secuencial,
            escenario: this.escenario,
            cripto: this.cripto,
            h24: this.h24,
            h48: this.h48,
            d5: this.d5,
            id_grupo: this.idGrupo
        });
    }
}