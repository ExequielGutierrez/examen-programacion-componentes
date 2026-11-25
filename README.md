# Examen Programación de Componentes

Autor: Exequiel Gutierrez

Cada ejercicio tiene su propia pantalla y se evalúa por separado. La interfaz usa Bootstrap.

## Enlaces

- Repositorio: https://github.com/ExequielGutierrez/examen-programacion-componentes
- Sitio: https://examen-componentes-exequiel.web.app

El enunciado pide el link de GitHub. El sitio está en Firebase Hosting, el mismo tipo de despliegue de la unidad, en un proyecto distinto al taller 2.

## Ejercicio 1

Componentes de clase, como pide el enunciado y la Unidad I.

- `ListaProductos` es el padre. Guarda el catálogo y el carrito en `state` y los actualiza con `this.setState`.
- `Producto` es el hijo. Muestra el producto y el botón.
- La lista se recorre con `map()`.
- Padre a hijo: el producto viaja por `props`.
- Hijo a padre: el botón llama al callback `onAgregar`.

## Ejercicio 2

Formulario con `simple-react-validator` y guardado en Cloud Firestore, colección `formularios`.

- Nombre obligatorio, de al menos 2 caracteres.
- Correo con formato válido.
- Mensaje de al menos 10 caracteres.
- Los registros se listan en tiempo real con `map()`.

## Ejercicio 3

- Bootstrap en las tres pantallas.
- Firebase Auth con correo y clave: crear cuenta, ingresar y cerrar sesión.
- Firebase Storage: subir un archivo a `archivos/{uid}/` con la sesión activa.
- El APK firmado, construido con Cordova, jarsigner, zipalign y apksigner, está en `docs/app-release.apk`.
- El informe de los tres ejercicios y de la construcción del APK está en `docs/Exequiel_Gutierrez.docx`.

## Configuración local

La configuración web de Firebase queda en `.env`, que no se sube a GitHub. Copia el ejemplo y completa los valores de la consola:

```bash
copy .env.example .env
npm install
npm run dev
```

Proyecto Firebase: `examen-componentes-exequiel`.

Authentication con correo y clave y Firebase Storage ya están habilitados. Los archivos se guardan en `archivos/{uid}/`. Firestore y Hosting funcionan en el mismo proyecto.

## Publicación

```bash
npm run build
firebase deploy --only hosting,firestore:rules,storage
```
