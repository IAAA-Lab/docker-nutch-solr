FROM solr:6.6.0

RUN solr-create -c nutch
COPY ./schema.xml /opt/solr/server/solr/nutch/conf/managed-schema
COPY ./solrconfig.xml /opt/solr/server/solr/nutch/conf/solrconfig.xml



