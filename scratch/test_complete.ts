import { CapturaCompletaCedulaUseCase } from '../src/Cedula/application/capturaCompletaCedula_UseCase';
import { db } from '../src/core/db_postgresql';
import { nucleoFamiliarRepository, direccionRepository, viviendaRepository, personaRepository, vacunacionRepository, cedulaRepository } from '../src/Cedula/infraestructure/cedula_dependencies';

async function run() {
  try {
    await new Promise(r => setTimeout(r, 2000));
    
    const useCase = new CapturaCompletaCedulaUseCase(
      nucleoFamiliarRepository,
      direccionRepository,
      viviendaRepository,
      personaRepository,
      vacunacionRepository,
      cedulaRepository
    );

    const payload = {
      unidad_salud_id: 1,
      entrevistador_id: 1,
      familia: {
        informante_nombre: "Juan Perez",
        domicilio: "Calle 1",
        localidad: "Localidad 1",
        manzana: "1A",
        vivienda_referencia: "Cerca de la tienda",
        rol_informante: "padre"
      },
      vivienda: {
        techo: "1",
        paredes: "1",
        piso: "1",
        cuartos: "2",
        habitantes: "4",
        agua_entubada: true,
        energia_electrica: true,
        cocina_ubicacion: "fuera_del_dormitorio",
        cocina_con_lena: false,
        manejo_excretas: "1",
        red_alcantarillado: true,
        fosa_septica: false,
        otros_animales: [1],
        otros_animales_especificar: "Perro",
        perros_gatos_dentro: true,
        mascotas_vacunas_corrientes: true,
        mascotas_esterilizadas: true,
        comentarios: "Ninguno"
      },
      vacunacion: {
        se_aplico_vacuna: true,
        vacunas: [
          { vacuna_id: 1, dosis_id: 1, fecha_aplicacion: "2023-01-01" }
        ]
      },
      integrantes: [
        {
          nombre: "Juan",
          apellidos: "Perez Lopez",
          sexo: "masculino",
          fecha_nacimiento: "1980-01-01",
          es_jefe: true,
          estado_civil: "1",
          parentesco: "2",
          lenguas: [1],
          escolaridad: "1",
          ocupacion: "1",
          ocupacion_texto: "",
          ingreso: "1",
          tiene_seguridad_social: true,
          tiene_discapacidad: false,
          discapacidad_texto: "",
          higiene: { higiene_bano_bucodental_diaria: true },
          alimentacion: { dias_proteina: 3, dias_frutas_verduras: 4, dias_cereales: 5 },
          enfermedades_cronicas: [1],
          toxicomanias: [1],
          salud_preventiva: { atencion_embarazo: 1 },
          servicio_salud: { frecuencia_servicio_salud: 1, motivo_uso: "Chequeo" }
        }
      ]
    };

    const res = await useCase.execute(payload);
    console.log("Success:", JSON.stringify(res));

  } catch (e: any) {
    console.error("Error:", e.message);
  } finally {
    db.close();
  }
}
run();
