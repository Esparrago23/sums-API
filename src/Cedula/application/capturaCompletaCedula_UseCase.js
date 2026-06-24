"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturaCompletaCedulaUseCase = void 0;
var db_postgresql_1 = require("../../core/db_postgresql");
var CapturaCompletaCedulaUseCase = /** @class */ (function () {
    function CapturaCompletaCedulaUseCase() {
    }
    CapturaCompletaCedulaUseCase.prototype.execute = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var warnings, familia, vivienda, nucleoId, direccionId, viviendaId, integrantesPayload, integrantes, personaByName, _i, integrantesPayload_1, integrante, created, key, cedulaId, inmunizaciones;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        warnings = [];
                        familia = (_a = this.objectValue(payload.familia)) !== null && _a !== void 0 ? _a : payload;
                        vivienda = (_b = this.objectValue(payload.vivienda)) !== null && _b !== void 0 ? _b : payload;
                        return [4 /*yield*/, this.createNucleo(familia)];
                    case 1:
                        nucleoId = _c.sent();
                        return [4 /*yield*/, this.createDireccionIfPresent(familia)];
                    case 2:
                        direccionId = _c.sent();
                        if (!direccionId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createNucleoDireccion(nucleoId, direccionId)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [4 /*yield*/, this.createVivienda(nucleoId, direccionId, vivienda)];
                    case 5:
                        viviendaId = _c.sent();
                        return [4 /*yield*/, this.createFamiliaAnimales(nucleoId, vivienda, warnings)];
                    case 6:
                        _c.sent();
                        integrantesPayload = this.arrayValue(payload.integrantes);
                        integrantes = [];
                        personaByName = new Map();
                        _i = 0, integrantesPayload_1 = integrantesPayload;
                        _c.label = 7;
                    case 7:
                        if (!(_i < integrantesPayload_1.length)) return [3 /*break*/, 10];
                        integrante = integrantesPayload_1[_i];
                        return [4 /*yield*/, this.createIntegrante(nucleoId, integrante, warnings)];
                    case 8:
                        created = _c.sent();
                        if (created) {
                            integrantes.push(created);
                            key = this.normalizeKey(created.nombre);
                            if (key)
                                personaByName.set(key, created.persona_id);
                        }
                        _c.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 7];
                    case 10: return [4 /*yield*/, this.createCedulaIfPossible(payload, nucleoId, warnings)];
                    case 11:
                        cedulaId = _c.sent();
                        return [4 /*yield*/, this.createVacunas(payload, personaByName, cedulaId, warnings)];
                    case 12:
                        inmunizaciones = _c.sent();
                        return [2 /*return*/, {
                                cedula_id: cedulaId,
                                nucleo_familiar_id: nucleoId,
                                direccion_id: direccionId,
                                vivienda_id: viviendaId,
                                integrantes: integrantes,
                                inmunizaciones: inmunizaciones,
                                warnings: warnings
                            }];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createNucleo = function (familia) {
        return __awaiter(this, void 0, void 0, function () {
            var comentarios, result;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        comentarios = [
                            this.textValue((_a = familia.informante_nombre) !== null && _a !== void 0 ? _a : familia.informanteNombre)
                                ? "Informante: ".concat(this.textValue((_b = familia.informante_nombre) !== null && _b !== void 0 ? _b : familia.informanteNombre))
                                : null,
                            this.textValue((_c = familia.rol_informante) !== null && _c !== void 0 ? _c : familia.rolInformante)
                                ? "Rol: ".concat(this.textValue((_d = familia.rol_informante) !== null && _d !== void 0 ? _d : familia.rolInformante))
                                : null
                        ].filter(Boolean).join(' | ') || null;
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO nucleo_familiar (fecha_registro, comentarios)\n       VALUES (NOW(), $1)\n       RETURNING id_nucleo_familiar;", [comentarios])];
                    case 1:
                        result = _e.sent();
                        return [2 /*return*/, result.rows[0].id_nucleo_familiar];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createDireccionIfPresent = function (familia) {
        return __awaiter(this, void 0, void 0, function () {
            var calle, localidad, manzana, viviendaReferencia, hasAny, result;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        calle = this.textValue((_a = familia.calle) !== null && _a !== void 0 ? _a : familia.domicilio);
                        localidad = this.textValue(familia.localidad);
                        manzana = this.textValue(familia.manzana);
                        viviendaReferencia = this.textValue((_c = (_b = familia.vivienda_referencia) !== null && _b !== void 0 ? _b : familia.viviendaReferencia) !== null && _c !== void 0 ? _c : familia.vivienda);
                        hasAny = [
                            calle,
                            familia.numero_exterior,
                            familia.numero_interior,
                            familia.colonia,
                            familia.codigo_postal,
                            localidad,
                            manzana,
                            viviendaReferencia,
                            familia.asentamiento_id
                        ].some(function (value) { return value !== undefined && value !== null && value !== ''; });
                        if (!hasAny)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO direccion (\n         calle, numero_exterior, numero_interior, colonia, codigo_postal,\n         localidad, manzana, vivienda_referencia, asentamiento_id\n       )\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)\n       RETURNING id_direccion;", [
                                calle,
                                this.textValue(familia.numero_exterior),
                                this.textValue(familia.numero_interior),
                                this.textValue(familia.colonia),
                                this.textValue(familia.codigo_postal),
                                localidad,
                                manzana,
                                viviendaReferencia,
                                this.intValue(familia.asentamiento_id)
                            ])];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, result.rows[0].id_direccion];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createNucleoDireccion = function (nucleoId, direccionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO nucleo_direccion (nucleo_familiar_id, direccion_id, fecha_asociacion)\n       VALUES ($1, $2, CURRENT_DATE);", [nucleoId, direccionId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createVivienda = function (nucleoId, direccionId, vivienda) {
        return __awaiter(this, void 0, void 0, function () {
            var materialTechoId, _a, materialParedesId, _b, materialPisoId, _c, manejoExcretasId, _d, result;
            var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            return __generator(this, function (_x) {
                switch (_x.label) {
                    case 0:
                        if (!((_e = this.intValue(vivienda.material_techo_id)) !== null && _e !== void 0)) return [3 /*break*/, 1];
                        _a = _e;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.techo)];
                    case 2:
                        _a = _x.sent();
                        _x.label = 3;
                    case 3:
                        materialTechoId = _a;
                        if (!((_f = this.intValue(vivienda.material_paredes_id)) !== null && _f !== void 0)) return [3 /*break*/, 4];
                        _b = _f;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.paredes)];
                    case 5:
                        _b = _x.sent();
                        _x.label = 6;
                    case 6:
                        materialParedesId = _b;
                        if (!((_g = this.intValue(vivienda.material_piso_id)) !== null && _g !== void 0)) return [3 /*break*/, 7];
                        _c = _g;
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, this.findOrCreateCatalog('cat_material', 'id_material', 'nombre', vivienda.piso)];
                    case 8:
                        _c = _x.sent();
                        _x.label = 9;
                    case 9:
                        materialPisoId = _c;
                        if (!((_h = this.intValue(vivienda.manejo_excretas_id)) !== null && _h !== void 0)) return [3 /*break*/, 10];
                        _d = _h;
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, this.findOrCreateCatalog('cat_manejo_excretas', 'id_manejo_excretas', 'nombre', vivienda.excretas)];
                    case 11:
                        _d = _x.sent();
                        _x.label = 12;
                    case 12:
                        manejoExcretasId = _d;
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO vivienda (\n         nucleo_familiar_id, direccion_id, numero_cuartos, numero_habitantes,\n         agua_entubada, energia_electrica, cocina_ubicacion, cocina_con_lena,\n         manejo_excretas_id, red_alcantarillado, fosa_septica, material_techo_id,\n         material_paredes_id, material_piso_id, material_otro_especificar,\n         perros_gatos_dentro, mascotas_vacunas_corrientes, mascotas_esterilizadas,\n         comentarios\n       )\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)\n       RETURNING id_vivienda;", [
                                nucleoId,
                                direccionId,
                                this.intValue((_j = vivienda.numero_cuartos) !== null && _j !== void 0 ? _j : vivienda.cuartos),
                                this.intValue((_k = vivienda.numero_habitantes) !== null && _k !== void 0 ? _k : vivienda.habitantes),
                                this.boolValue(vivienda.agua_entubada),
                                this.boolValue(vivienda.energia_electrica),
                                this.cocinaValue((_l = vivienda.cocina_ubicacion) !== null && _l !== void 0 ? _l : vivienda.cocina),
                                this.boolValue((_o = (_m = vivienda.cocina_con_lena) !== null && _m !== void 0 ? _m : vivienda.coccion_lena) !== null && _o !== void 0 ? _o : vivienda.coccionLena),
                                manejoExcretasId,
                                this.boolValue((_p = vivienda.red_alcantarillado) !== null && _p !== void 0 ? _p : vivienda.alcantarillado),
                                this.boolValue(vivienda.fosa_septica),
                                materialTechoId,
                                materialParedesId,
                                materialPisoId,
                                this.textValue((_r = (_q = vivienda.material_otro_especificar) !== null && _q !== void 0 ? _q : vivienda.material_otros) !== null && _r !== void 0 ? _r : vivienda.materialOtros),
                                this.boolValue((_t = (_s = vivienda.perros_gatos_dentro) !== null && _s !== void 0 ? _s : vivienda.perros_gatos) !== null && _t !== void 0 ? _t : vivienda.perrosGatos),
                                this.boolValue((_v = (_u = vivienda.mascotas_vacunas_corrientes) !== null && _u !== void 0 ? _u : vivienda.animales_vacunas) !== null && _v !== void 0 ? _v : vivienda.animalesVacunas),
                                this.boolValue((_w = vivienda.mascotas_esterilizadas) !== null && _w !== void 0 ? _w : vivienda.esterilizados),
                                this.textValue(vivienda.comentarios)
                            ])];
                    case 13:
                        result = _x.sent();
                        return [2 /*return*/, result.rows[0].id_vivienda];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createFamiliaAnimales = function (nucleoId, vivienda, warnings) {
        return __awaiter(this, void 0, void 0, function () {
            var animales, _i, animales_1, animal, animalNombre, animalId;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        animales = __spreadArray(__spreadArray([], this.arrayValue((_a = vivienda.otros_animales) !== null && _a !== void 0 ? _a : vivienda.otrosAnimales), true), [
                            this.textValue((_b = vivienda.animal_otro) !== null && _b !== void 0 ? _b : vivienda.animalOtro)
                        ], false).filter(Boolean);
                        _i = 0, animales_1 = animales;
                        _e.label = 1;
                    case 1:
                        if (!(_i < animales_1.length)) return [3 /*break*/, 5];
                        animal = animales_1[_i];
                        animalNombre = this.textValue(animal);
                        if (!animalNombre || this.normalizeKey(animalNombre) === 'na')
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_animal', 'id_animal', 'nombre', animalNombre === 'Otros' ? 'Otro' : animalNombre)];
                    case 2:
                        animalId = _e.sent();
                        if (!animalId) {
                            warnings.push("No se pudo resolver animal: ".concat(animalNombre));
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO familia_animal (nucleo_familiar_id, animal_id, otro_especificar, comentarios)\n         VALUES ($1, $2, $3, $4);", [
                                nucleoId,
                                animalId,
                                animalNombre === 'Otros' ? this.textValue((_c = vivienda.animal_otro) !== null && _c !== void 0 ? _c : vivienda.animalOtro) : null,
                                this.textValue((_d = vivienda.animal_observaciones) !== null && _d !== void 0 ? _d : vivienda.animalObservaciones)
                            ])];
                    case 3:
                        _e.sent();
                        _e.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createIntegrante = function (nucleoId, integrante, warnings) {
        return __awaiter(this, void 0, void 0, function () {
            var nombre, fechaNacimiento, sexo, estadoCivilId, lenguaId, escolaridadId, ingresoId, parentescoId, nameParts, personaResult, personaId, ocupacionTexto, nucleoPersonaResult;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        nombre = this.textValue((_a = integrante.nombre) !== null && _a !== void 0 ? _a : integrante.nombre_completo);
                        if (!nombre) {
                            warnings.push('Integrante omitido: falta nombre');
                            return [2 /*return*/, null];
                        }
                        fechaNacimiento = (_c = this.dateValue((_b = integrante.fecha_nacimiento) !== null && _b !== void 0 ? _b : integrante.fechaNacimiento)) !== null && _c !== void 0 ? _c : this.dateFromAge(integrante.edad);
                        if (!fechaNacimiento) {
                            warnings.push("Integrante omitido (".concat(nombre, "): falta fecha de nacimiento o edad"));
                            return [2 /*return*/, null];
                        }
                        sexo = this.sexoValue(integrante.sexo);
                        if (!sexo) {
                            warnings.push("Integrante omitido (".concat(nombre, "): falta sexo masculino/femenino"));
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_estado_civil', 'id_estado_civil', 'nombre', (_d = integrante.estado_civil) !== null && _d !== void 0 ? _d : integrante.estadoCivil)];
                    case 1:
                        estadoCivilId = _k.sent();
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_lengua', 'id_lengua', 'nombre', integrante.lengua)];
                    case 2:
                        lenguaId = _k.sent();
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_escolaridad', 'id_escolaridad', 'nombre', integrante.escolaridad)];
                    case 3:
                        escolaridadId = _k.sent();
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_ingreso_salarial', 'id_ingreso_salarial', 'rango', integrante.ingreso)];
                    case 4:
                        ingresoId = _k.sent();
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_parentesco', 'id_parentesco', 'nombre', (_e = integrante.parentesco) !== null && _e !== void 0 ? _e : integrante.rol)];
                    case 5:
                        parentescoId = _k.sent();
                        nameParts = this.splitName(nombre);
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona (\n         primer_nombre, segundo_nombre, apellido_paterno, apellido_materno,\n         fecha_nacimiento, sexo, estado_civil_id, alfabetizacion, fecha_registro\n       )\n       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())\n       RETURNING id_persona;", [
                                nameParts.primer_nombre,
                                nameParts.segundo_nombre,
                                nameParts.apellido_paterno,
                                nameParts.apellido_materno,
                                fechaNacimiento,
                                sexo,
                                estadoCivilId,
                                this.boolValue(integrante.alfabetizacion)
                            ])];
                    case 6:
                        personaResult = _k.sent();
                        personaId = personaResult.rows[0].id_persona;
                        if (!lenguaId) return [3 /*break*/, 8];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_lengua (persona_id, lengua_id, lengua_indigena_especificar, es_principal)\n         VALUES ($1, $2, $3, true);", [personaId, lenguaId, this.textValue((_f = integrante.lengua_indigena_especificar) !== null && _f !== void 0 ? _f : integrante.lenguaEspecificar)])];
                    case 7:
                        _k.sent();
                        _k.label = 8;
                    case 8:
                        if (!escolaridadId) return [3 /*break*/, 10];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_escolaridad (persona_id, escolaridad_id, fecha_registro)\n         VALUES ($1, $2, CURRENT_DATE);", [personaId, escolaridadId])];
                    case 9:
                        _k.sent();
                        _k.label = 10;
                    case 10:
                        ocupacionTexto = this.textValue((_g = integrante.ocupacion_texto) !== null && _g !== void 0 ? _g : integrante.ocupacion);
                        if (!ocupacionTexto) return [3 /*break*/, 12];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_ocupacion (persona_id, ocupacion_id, ocupacion_texto, fecha_registro)\n         VALUES ($1, NULL, $2, CURRENT_DATE);", [personaId, ocupacionTexto])];
                    case 11:
                        _k.sent();
                        _k.label = 12;
                    case 12:
                        if (!ingresoId) return [3 /*break*/, 14];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_ingreso (persona_id, ingreso_salarial_id, fecha_registro)\n         VALUES ($1, $2, CURRENT_DATE);", [personaId, ingresoId])];
                    case 13:
                        _k.sent();
                        _k.label = 14;
                    case 14: return [4 /*yield*/, this.createIntegranteSalud(personaId, integrante)];
                    case 15:
                        _k.sent();
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO nucleo_persona (nucleo_familiar_id, persona_id, parentesco_id, fecha_registro)\n       VALUES ($1, $2, $3, NOW())\n       ON CONFLICT (nucleo_familiar_id, persona_id) DO NOTHING\n       RETURNING id_nucleo_persona;", [nucleoId, personaId, parentescoId])];
                    case 16:
                        nucleoPersonaResult = _k.sent();
                        return [2 /*return*/, {
                                persona_id: personaId,
                                nucleo_persona_id: (_j = (_h = nucleoPersonaResult.rows[0]) === null || _h === void 0 ? void 0 : _h.id_nucleo_persona) !== null && _j !== void 0 ? _j : null,
                                nombre: nombre
                            }];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createIntegranteSalud = function (personaId, integrante) {
        return __awaiter(this, void 0, void 0, function () {
            var diasProteina, diasFrutasVerduras, diasCereales;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        diasProteina = this.intValue((_a = integrante.dias_proteina) !== null && _a !== void 0 ? _a : integrante.proteina);
                        diasFrutasVerduras = this.intValue((_c = (_b = integrante.dias_frutas_verduras) !== null && _b !== void 0 ? _b : integrante.frutas_verduras) !== null && _c !== void 0 ? _c : integrante.frutasVerduras);
                        diasCereales = this.intValue((_d = integrante.dias_cereales) !== null && _d !== void 0 ? _d : integrante.cereales);
                        if (![diasProteina, diasFrutasVerduras, diasCereales].some(function (value) { return value !== null; })) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_alimentacion (persona_id, dias_proteina, dias_frutas_verduras, dias_cereales, fecha_registro)\n         VALUES ($1, $2, $3, $4, CURRENT_DATE);", [
                                personaId,
                                this.daysValue(diasProteina),
                                this.daysValue(diasFrutasVerduras),
                                this.daysValue(diasCereales)
                            ])];
                    case 1:
                        _m.sent();
                        _m.label = 2;
                    case 2:
                        if (!(integrante.higiene !== undefined || integrante.higiene_bano_bucodental_diaria !== undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_higiene (persona_id, higiene_bano_bucodental_diaria, fecha_registro)\n         VALUES ($1, $2, CURRENT_DATE);", [personaId, (_f = this.boolValue((_e = integrante.higiene_bano_bucodental_diaria) !== null && _e !== void 0 ? _e : integrante.higiene)) !== null && _f !== void 0 ? _f : false])];
                    case 3:
                        _m.sent();
                        _m.label = 4;
                    case 4:
                        if (!(integrante.seguridad_social !== undefined || integrante.cuenta_seguridad_social !== undefined)) return [3 /*break*/, 6];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_seguridad_social (persona_id, cuenta_seguridad_social, fecha_registro)\n         VALUES ($1, $2, CURRENT_DATE);", [personaId, (_h = this.boolValue((_g = integrante.cuenta_seguridad_social) !== null && _g !== void 0 ? _g : integrante.seguridad_social)) !== null && _h !== void 0 ? _h : false])];
                    case 5:
                        _m.sent();
                        _m.label = 6;
                    case 6:
                        if (!(integrante.discapacidad !== undefined || integrante.presenta_discapacidad !== undefined || integrante.tipo_discapacidad)) return [3 /*break*/, 8];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_discapacidad (persona_id, presenta_discapacidad, tipo_discapacidad)\n         VALUES ($1, $2, $3);", [
                                personaId,
                                (_k = this.boolValue((_j = integrante.presenta_discapacidad) !== null && _j !== void 0 ? _j : integrante.discapacidad)) !== null && _k !== void 0 ? _k : Boolean(integrante.tipo_discapacidad),
                                this.textValue((_l = integrante.tipo_discapacidad) !== null && _l !== void 0 ? _l : integrante.tipoDiscapacidad)
                            ])];
                    case 7:
                        _m.sent();
                        _m.label = 8;
                    case 8: return [4 /*yield*/, this.createToxicomanias(personaId, integrante)];
                    case 9:
                        _m.sent();
                        return [4 /*yield*/, this.createCronicas(personaId, integrante)];
                    case 10:
                        _m.sent();
                        return [4 /*yield*/, this.createSaludPreventiva(personaId, integrante)];
                    case 11:
                        _m.sent();
                        return [4 /*yield*/, this.createServicioSalud(personaId, integrante)];
                    case 12:
                        _m.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createToxicomanias = function (personaId, integrante) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, toxicomania, nombre, toxicomaniaId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = this.arrayValue(integrante.toxicomanias);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        toxicomania = _a[_i];
                        nombre = this.textValue(toxicomania);
                        if (!nombre || this.normalizeKey(nombre) === 'na')
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_toxicomania', 'id_toxicomania', 'nombre', nombre)];
                    case 2:
                        toxicomaniaId = _c.sent();
                        if (!toxicomaniaId)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_toxicomania (persona_id, toxicomania_id, otra_sustancia)\n         VALUES ($1, $2, $3);", [personaId, toxicomaniaId, this.textValue((_b = integrante.otra_sustancia) !== null && _b !== void 0 ? _b : integrante.otraSustancia)])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createCronicas = function (personaId, integrante) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, cronica, nombre, cronicaId;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _i = 0, _a = this.arrayValue((_b = integrante.enfermedades_cronicas) !== null && _b !== void 0 ? _b : integrante.cronicas);
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        cronica = _a[_i];
                        nombre = this.textValue(cronica);
                        if (!nombre || this.normalizeKey(nombre) === 'na')
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, this.findOrCreateCatalog('cat_enfermedad_cronica', 'id_enfermedad_cronica', 'nombre', nombre)];
                    case 2:
                        cronicaId = _c.sent();
                        if (!cronicaId)
                            return [3 /*break*/, 4];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_enfermedad_cronica (persona_id, enfermedad_cronica_id)\n         VALUES ($1, $2);", [personaId, cronicaId])];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createSaludPreventiva = function (personaId, integrante) {
        return __awaiter(this, void 0, void 0, function () {
            var atencionEmbarazoId, cervico, mama, fechaCervico, fechaMama;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.findOrCreateCatalog('cat_atencion_embarazo', 'id_atencion_embarazo', 'nombre', (_a = integrante.atencion_embarazo) !== null && _a !== void 0 ? _a : integrante.embarazo)];
                    case 1:
                        atencionEmbarazoId = _f.sent();
                        cervico = this.boolOrNullFromTamizaje((_b = integrante.tamizaje_cervico_uterino) !== null && _b !== void 0 ? _b : integrante.tamizajeCervico);
                        mama = this.boolOrNullFromTamizaje((_c = integrante.tamizaje_cancer_mama) !== null && _c !== void 0 ? _c : integrante.tamizajeMama);
                        fechaCervico = this.dateValue((_d = integrante.fecha_tamizaje_cervico_uterino) !== null && _d !== void 0 ? _d : integrante.fechaCervico);
                        fechaMama = this.dateValue((_e = integrante.fecha_tamizaje_cancer_mama) !== null && _e !== void 0 ? _e : integrante.fechaMama);
                        if (!(atencionEmbarazoId || cervico !== null || mama !== null || fechaCervico || fechaMama)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_salud_preventiva (\n           persona_id, atencion_embarazo_id, tamizaje_cervico_uterino,\n           fecha_tamizaje_cervico_uterino, tamizaje_cancer_mama,\n           fecha_tamizaje_cancer_mama, fecha_registro\n         )\n         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE);", [personaId, atencionEmbarazoId, cervico, fechaCervico, mama, fechaMama])];
                    case 2:
                        _f.sent();
                        _f.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createServicioSalud = function (personaId, integrante) {
        return __awaiter(this, void 0, void 0, function () {
            var frecuenciaId, motivo;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.findOrCreateCatalog('cat_frecuencia_servicio_salud', 'id_frecuencia_servicio_salud', 'nombre', (_a = integrante.frecuencia_servicio_salud) !== null && _a !== void 0 ? _a : integrante.frecuenciaSalud)];
                    case 1:
                        frecuenciaId = _c.sent();
                        motivo = this.textValue((_b = integrante.motivo_uso) !== null && _b !== void 0 ? _b : integrante.motivoSalud);
                        if (!(frecuenciaId || motivo)) return [3 /*break*/, 3];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO persona_servicio_salud (persona_id, frecuencia_servicio_salud_id, motivo_uso, fecha_registro)\n         VALUES ($1, $2, $3, CURRENT_DATE);", [personaId, frecuenciaId, motivo])];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createCedulaIfPossible = function (payload, nucleoId, warnings) {
        return __awaiter(this, void 0, void 0, function () {
            var unidadSaludId, entrevistadorId, estado, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        unidadSaludId = this.intValue(payload.unidad_salud_id);
                        entrevistadorId = this.intValue(payload.entrevistador_id);
                        if (!unidadSaludId || !entrevistadorId) {
                            warnings.push('Cedula formal no creada: faltan unidad_salud_id y/o entrevistador_id.');
                            return [2 /*return*/, null];
                        }
                        estado = (_a = this.estadoCedulaValue(payload.estado)) !== null && _a !== void 0 ? _a : 'borrador';
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO cedula (\n         unidad_salud_id, entrevistador_id, levantamiento_id, nucleo_familiar_id,\n         fecha_registro, estado, observaciones\n       )\n       VALUES ($1, $2, $3, $4, $5, $6, $7)\n       RETURNING id_cedula;", [
                                unidadSaludId,
                                entrevistadorId,
                                this.intValue(payload.levantamiento_id),
                                nucleoId,
                                (_b = this.dateValue(payload.fecha_registro)) !== null && _b !== void 0 ? _b : this.today(),
                                estado,
                                this.textValue(payload.observaciones)
                            ])];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, result.rows[0].id_cedula];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createVacunas = function (payload, personaByName, cedulaId, warnings) {
        return __awaiter(this, void 0, void 0, function () {
            var vacunacion, seAplico, vacunas, result, _i, vacunas_1, vacunaPayload, personaId, vacunaNombre, vacunaId, _a, dosisId, _b, esquemaId, inmunizacion;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        vacunacion = (_c = this.objectValue(payload.vacunacion)) !== null && _c !== void 0 ? _c : payload;
                        seAplico = this.boolValue((_d = vacunacion.se_aplico_vacuna) !== null && _d !== void 0 ? _d : vacunacion.seAplicoVacuna);
                        vacunas = this.arrayValue((_e = vacunacion.vacunas) !== null && _e !== void 0 ? _e : payload.vacunas);
                        if (seAplico === false || vacunas.length === 0)
                            return [2 /*return*/, []];
                        result = [];
                        _i = 0, vacunas_1 = vacunas;
                        _r.label = 1;
                    case 1:
                        if (!(_i < vacunas_1.length)) return [3 /*break*/, 11];
                        vacunaPayload = vacunas_1[_i];
                        personaId = (_f = this.intValue(vacunaPayload.persona_id)) !== null && _f !== void 0 ? _f : personaByName.get((_h = this.normalizeKey((_g = vacunaPayload.paciente) !== null && _g !== void 0 ? _g : vacunaPayload.nombre)) !== null && _h !== void 0 ? _h : '');
                        if (!personaId) {
                            warnings.push("Vacuna omitida: no se encontro persona para ".concat((_j = this.textValue(vacunaPayload.paciente)) !== null && _j !== void 0 ? _j : 'paciente sin nombre'));
                            return [3 /*break*/, 10];
                        }
                        vacunaNombre = this.textValue((_l = (_k = vacunaPayload.vacuna) !== null && _k !== void 0 ? _k : vacunaPayload.tipo) !== null && _l !== void 0 ? _l : vacunaPayload.vacuna_aplicada);
                        if (!((_m = this.intValue(vacunaPayload.vacuna_id)) !== null && _m !== void 0)) return [3 /*break*/, 2];
                        _a = _m;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.findOrCreateCatalog('vacuna', 'id_vacuna', 'nombre', vacunaNombre)];
                    case 3:
                        _a = _r.sent();
                        _r.label = 4;
                    case 4:
                        vacunaId = _a;
                        if (!vacunaId) {
                            warnings.push("Vacuna omitida: no se pudo resolver vacuna para persona ".concat(personaId));
                            return [3 /*break*/, 10];
                        }
                        if (!((_o = this.intValue(vacunaPayload.dosis_id)) !== null && _o !== void 0)) return [3 /*break*/, 5];
                        _b = _o;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.findOrCreateCatalog('cat_dosis', 'id_dosis', 'nombre', vacunaPayload.dosis)];
                    case 6:
                        _b = _r.sent();
                        _r.label = 7;
                    case 7:
                        dosisId = _b;
                        return [4 /*yield*/, this.createEsquemaVacunacion(personaId, this.intValue(payload.unidad_salud_id))];
                    case 8:
                        esquemaId = _r.sent();
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO inmunizacion (\n           esquema_vacunacion_id, cedula_id, vacuna_id, dosis_id,\n           otra_vacuna_especificar, fecha_aplicacion\n         )\n         VALUES ($1, $2, $3, $4, $5, $6)\n         RETURNING id_inmunizacion;", [
                                esquemaId,
                                cedulaId,
                                vacunaId,
                                dosisId,
                                this.textValue((_p = vacunaPayload.otra_vacuna_especificar) !== null && _p !== void 0 ? _p : vacunaPayload.otraVacuna),
                                (_q = this.dateValue(vacunaPayload.fecha_aplicacion)) !== null && _q !== void 0 ? _q : this.today()
                            ])];
                    case 9:
                        inmunizacion = _r.sent();
                        result.push({
                            inmunizacion_id: inmunizacion.rows[0].id_inmunizacion,
                            persona_id: personaId,
                            vacuna: vacunaNombre
                        });
                        _r.label = 10;
                    case 10:
                        _i++;
                        return [3 /*break*/, 1];
                    case 11: return [2 /*return*/, result];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.createEsquemaVacunacion = function (personaId, unidadSaludId) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO esquema_vacunacion (persona_id, unidad_salud_id, fecha_registro)\n       VALUES ($1, $2, CURRENT_DATE)\n       RETURNING id_esquema_vacunacion;", [personaId, unidadSaludId])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows[0].id_esquema_vacunacion];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.findOrCreateCatalog = function (tableName, idColumn, labelColumn, rawValue) {
        return __awaiter(this, void 0, void 0, function () {
            var value, found, created;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        value = this.textValue(rawValue);
                        if (!value || this.normalizeKey(value) === 'na')
                            return [2 /*return*/, null];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("SELECT ".concat(idColumn, " AS id FROM ").concat(tableName, " WHERE LOWER(").concat(labelColumn, ") = LOWER($1) LIMIT 1;"), [value])];
                    case 1:
                        found = _a.sent();
                        if (found.rowCount > 0)
                            return [2 /*return*/, found.rows[0].id];
                        return [4 /*yield*/, db_postgresql_1.db.executePreparedQuery("INSERT INTO ".concat(tableName, " (").concat(labelColumn, ")\n       VALUES ($1)\n       ON CONFLICT (").concat(labelColumn, ") DO UPDATE SET ").concat(labelColumn, " = EXCLUDED.").concat(labelColumn, "\n       RETURNING ").concat(idColumn, " AS id;"), [value])];
                    case 2:
                        created = _a.sent();
                        return [2 /*return*/, created.rows[0].id];
                }
            });
        });
    };
    CapturaCompletaCedulaUseCase.prototype.splitName = function (nombre) {
        var parts = nombre.split(/\s+/).filter(Boolean);
        if (parts.length === 1) {
            return {
                primer_nombre: parts[0],
                segundo_nombre: null,
                apellido_paterno: 'SIN APELLIDO',
                apellido_materno: null
            };
        }
        if (parts.length === 2) {
            return {
                primer_nombre: parts[0],
                segundo_nombre: null,
                apellido_paterno: parts[1],
                apellido_materno: null
            };
        }
        return {
            primer_nombre: parts[0],
            segundo_nombre: parts.slice(1, -2).join(' ') || null,
            apellido_paterno: parts[parts.length - 2],
            apellido_materno: parts[parts.length - 1]
        };
    };
    CapturaCompletaCedulaUseCase.prototype.objectValue = function (value) {
        return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
    };
    CapturaCompletaCedulaUseCase.prototype.arrayValue = function (value) {
        if (!value)
            return [];
        if (Array.isArray(value))
            return value.filter(function (item) { return item !== undefined && item !== null; });
        if (value instanceof Set)
            return Array.from(value).map(function (item) { return ({ value: item }); });
        return [];
    };
    CapturaCompletaCedulaUseCase.prototype.textValue = function (value) {
        if (value === undefined || value === null)
            return null;
        var text = String(value).trim();
        return text.length > 0 ? text : null;
    };
    CapturaCompletaCedulaUseCase.prototype.intValue = function (value) {
        if (value === undefined || value === null || value === '')
            return null;
        var parsed = Number(value);
        return Number.isInteger(parsed) ? parsed : null;
    };
    CapturaCompletaCedulaUseCase.prototype.daysValue = function (value) {
        if (value === null || Number.isNaN(value))
            return 0;
        return Math.max(0, Math.min(7, value));
    };
    CapturaCompletaCedulaUseCase.prototype.boolValue = function (value) {
        if (value === undefined || value === null || value === '')
            return null;
        if (typeof value === 'boolean')
            return value;
        var normalized = this.normalizeKey(value);
        if (['si', 'sí', 'true', '1', 'yes'].includes(normalized !== null && normalized !== void 0 ? normalized : ''))
            return true;
        if (['no', 'false', '0'].includes(normalized !== null && normalized !== void 0 ? normalized : ''))
            return false;
        return null;
    };
    CapturaCompletaCedulaUseCase.prototype.boolOrNullFromTamizaje = function (value) {
        var normalized = this.normalizeKey(value);
        if (!normalized || normalized === 'na')
            return null;
        return this.boolValue(value);
    };
    CapturaCompletaCedulaUseCase.prototype.sexoValue = function (value) {
        var normalized = this.normalizeKey(value);
        if (!normalized)
            return null;
        if (normalized.startsWith('masculino'))
            return 'masculino';
        if (normalized.startsWith('femenino'))
            return 'femenino';
        return null;
    };
    CapturaCompletaCedulaUseCase.prototype.cocinaValue = function (value) {
        var normalized = this.normalizeKey(value);
        if (!normalized)
            return null;
        if (normalized.includes('dentro'))
            return 'dentro_del_dormitorio';
        if (normalized.includes('fuera'))
            return 'fuera_del_dormitorio';
        return null;
    };
    CapturaCompletaCedulaUseCase.prototype.estadoCedulaValue = function (value) {
        var normalized = this.normalizeKey(value);
        if (!normalized)
            return null;
        if (['borrador', 'sincronizada', 'validada', 'cerrada'].includes(normalized)) {
            return normalized;
        }
        return null;
    };
    CapturaCompletaCedulaUseCase.prototype.dateValue = function (value) {
        var text = this.textValue(value);
        if (!text)
            return null;
        var mexicanDate = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
        if (mexicanDate) {
            var day = mexicanDate[1].padStart(2, '0');
            var month = mexicanDate[2].padStart(2, '0');
            var year = mexicanDate[3];
            var normalized = "".concat(year, "-").concat(month, "-").concat(day);
            var parsedMexicanDate = new Date(normalized);
            return Number.isNaN(parsedMexicanDate.getTime()) ? null : normalized;
        }
        var parsed = new Date(text);
        if (Number.isNaN(parsed.getTime()))
            return null;
        return parsed.toISOString().slice(0, 10);
    };
    CapturaCompletaCedulaUseCase.prototype.dateFromAge = function (value) {
        var age = this.intValue(value);
        if (age === null || age < 0)
            return null;
        var year = new Date().getFullYear() - age;
        return "".concat(year, "-01-01");
    };
    CapturaCompletaCedulaUseCase.prototype.today = function () {
        return new Date().toISOString().slice(0, 10);
    };
    CapturaCompletaCedulaUseCase.prototype.normalizeKey = function (value) {
        var text = this.textValue(value);
        if (!text)
            return null;
        return text.toLowerCase();
    };
    return CapturaCompletaCedulaUseCase;
}());
exports.CapturaCompletaCedulaUseCase = CapturaCompletaCedulaUseCase;
