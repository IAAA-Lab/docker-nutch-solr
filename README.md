# Nutch Crawler sobre Solr

<!-- TOC START min:2 max:3 link:true update:true -->
- [Configuración del servicio](#configuracin-del-servicio)
  - [Docker Compose](#docker-compose)
- [Lanzamiento](#lanzamiento)
  - [Modo interactivo](#modo-interactivo)
  - [Modo servicio](#modo-servicio)
- [Consulta de resultados](#consulta-de-resultados)
- [Detención del sistema](#detencin-del-sistema)

<!-- TOC END -->

## Configuración del servicio

Los ficheros de este proyecto son:

```
./
|-- nutch/
|    |--nutch-site.xml
|    |--regex-urlfilter.txt
|    |--seed.txt
|-- solr/
|    |--managed-schema
|    |--solrconfig.xml
|-- docker-compose.yml
```

### Docker Compose

Es el fichero que configura el despliegue de los dos servicios: `nutch` y `solr`.

#### Configuración de Solr

```yaml
solr:
   image: solr:6.6.0@sha256:e8f279c9ab594525ab0344c0cb44d5f2a2e308bec3e14a11648095af15cad90b
   container_name: solr
   volumes:
     - ./solr/managed-schema:/opt/solr/server/solr/configsets/basic_configs/conf/managed-schema:ro
     - ./solr/solrconfig.xml:/opt/solr/server/solr/configsets/basic_configs/conf/solrconfig.xml:ro
   command: solr-create -c nutch -d basic_configs
   ports:
      - 8983:8983
```

* **image:** Define la imagen base que se va a descargar y usar en ese servicio. Además se establece el `digest`, que garantiza que la versión descargada será la misma siempre.

* **container_name:** Fija el nombre del contenedor. Esto es importante para el routing interno ya que los contenedores dentro de una misma red se encuentran entre sí mediante su `container_name` gracias a un servicio interno de `dns` de Docker.

* **volumes:** Define los puntos de montaje de `volúmenes` y `bindings`. En este caso, sólo se han utilizado bindings para simplificar el fichero. Los bindings emparejan un directorio o fichero local del `host` y uno del `container` bajo unos permisos `permissions` mediante la sintaxis `host_dir:container_dir[:permissions]`.

* **command:** es el comando de entrada que se ejecutará. En este caso, es un parámetro que se pasa a otro script. [más info sobre esto](https://www.ctl.io/developers/blog/post/dockerfile-entrypoint-vs-cmd#entrypoint-and-cmd)

* **port:** Hace un `binding` de puertos del `host` a puertos del `container` mediante la sintaxys `host_port:container_port` El puerto no es necesario para comunicación, pero sí para acceder a la interfaz web http://localhost:8983/solr/

La clave del funcionamiento de éste contenedor radica en el `binding` de los ficheros de configuración al lugar donde está la plantilla de configuración por defecto. Esto hace que al crearse el `core`, se utilicen estos ficheros sumados al resto de ficheros por defecto.

#### Configuración de Nutch

```yaml
nutch:
   image: apache/nutch:release-1.13@sha256:270a933f2311f7f8b4d477139d72fcb95eec284903642c6515c279aafaa09e66
   container_name: nutch
   environment:
     JAVA_HOME: /usr/lib/jvm/java-7-oracle/jre/
   volumes:
     - ./nutch/nutch-site.xml:/root/nutch/conf/nutch-site.xml:ro
     - ./nutch/regex-urlfilter.txt:/root/nutch/conf/regex-urlfilter.txt:ro
     - ./nutch/seed.txt:/root/nutch/urls/seed.txt:ro
   #IMPORTANTE: Existen dos modos de ejecución: `interactivo` (tty) o `servicio` (command). Mantener uno de los dos comentado
   tty: true
   # command: /root/nutch/bin/crawl -i -D solr.server.url=http://solr:8983/solr/nutch /root/nutch/urls/seed.txt TestCrawl 2 #Ejecuta el crawling automáticamente
   depends_on:
      - solr
```
* **environment:** Permite definir variables de entorno para el contenedor. Es **muy últil** en imágenes pensadas para explotar ésta funcionalidad. No es este el caso, ya que el uso de la misma se debe a una mala contrucción de la imagen, que hace imposible ejecutar el contenedor como un _servicio_.

* **depends_on:** Define una relación de dependencia entre dos contenedores. Esto implica que hasta que un contenedor no ha arrancado correctamente, el otro no se inicia. No sólo sirve para _esperar_ a otro contenedor, también permite propagar el _arranque_ de los contenedores de los que uno depende cuando se hacen _arranques individuales_.

* **tty:** Un contenedor de Docker está pensado para ejecutar un servicio y detenerse al finalizar el mismo. En ocasiones, el funcionamiento deseado es otro, y en esos casos hay que recurrir a algún `hack` o truco para adaptarlo a nuestras necesidades. En este caso, `tty` hace que una vez haya terminado su proceso de arranque (o cuando el proceso de arranque no existe, como es el caso), el contenedor no se detenga, sino que siga en ejecución simulando tener una terminal abierta. **Esto nos permitirá probar varios comandos del crawler sobre el mismo contenedor así como ejecutar cualquier otro comando dentro de él**.

* **command:** Si por el contrario se quiere utilizar el contenedor como un servicio (tal y como Docker está pensado), este comando ejecutará el proceso de `crawling` definido en el enunciado de forma automática.

## Lanzamiento

La ejecución canónica de un Docker Compose es `docker-compose up -d`. No obstante, es una buena práctica acostumbrarse a desplegar sólo el servicio deseado (y sus dependencias). Por ello el comando aconsejado es:

```
docker-compose up -d nutch
```

Esto ejecutará ambos contenedores ya que, debido al parámetro `depends_on`, `nutch` no puede iniciarse sin `solr`.

Independientemente del modo en el que lo estemos lanzamos, el comando `docker-compose` terminará cuando ambos contenedores estén en marcha.

### Modo interactivo

Si se está ejecutando el servicio en modo interactivo (con la línea de `commad` del fichero `docker-compose.yml` comentada), la forma de acceder a una consola dentro del contenedor es mediante:

```
docker exec \
-it \
nutch \
bash
```

* **docker exec:** Comando que ejecuta una terminal dentro de un contenedor en ejecución ya existente.
* **-it:** Activa el modo interactivo y vincula la consola actual a la nueva dentro del contenedor.
* **nutch:** Nombre del contenedor al que nos conectamos.
* **bash:** Comando que se ejecuta dentro de esa consola.

Otra opción es utilizar repetidamente `docker exec -it nutch <COMANDO DESEADO>` lo que abrirá una temrinal con el comando ejecutado y saldrá de ella cuando el comando acabe.

### Modo servicio

En el modo servicio no veremos nada ya que ninguna de las dos temrinales de los contenedores está vinculada a la nuestra.

Una forma sencilla de consultar el estado de los procesos es mediante `docker ps` que listará los contenedores activos y mediante `docker logs nutch` o `locker logs solr` que escribirá por pantalla lo último escrito por cada contenedor. **Nota:** Este último comando tan sólo hace un `cat`. No muestra modificaciones en tiempo real.

Otra forma de vincular ambas terminales, de modo que veamos los cambios en tiempo real, es mediante `docker attach nutch` o `docker attach solr`. El punto negativo de este método es que una vez vinculadas, la única forma de desvincularlas es matando el proceso con `Crtl-C`, lo que detendrá además el contenedor.

## Consulta de resultados

La mejor forma de consultar los resultados es accediendo al portal web de Solr en:

- http://localhost:8983/solr/


## Detención del sistema

Existen dos formas de detener el sistema:

* **Mediante `docker-compose stop`:** Detiene los contenedores, pero mantienen los cambios hechos y sus datos almacenados. La próxima vez que _arranque_ el servicio con `up -d` los contenedores se reiniciarán con normalidad.

* **Mediante `docker-compose down`:** Detiene los contenedores, los borra y borra toda la información almacenada en ellos así como las redes virtuales creadas para conectarlos. La próxima vez que _arranque_ el servicio con `up -d` los contenedores volverán a ser creados desde cero (_fresh start_). **Nota:** Este es el paso recomendado cuando se quiere garantizar que todo el proceso es automático y no hay dependencias extra como configuraciones manuales hechas sobre los contenedores.
