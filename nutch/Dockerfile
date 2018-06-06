FROM apache/nutch:release-1.14

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd

RUN mkdir /entrypoint && \
    curl https://raw.githubusercontent.com/eficode/wait-for/master/wait-for -o /entrypoint/wait-for && \
    chmod +x /entrypoint/wait-for

COPY ./nutch-site.xml ./regex-urlfilter.txt /root/nutch/conf/
COPY ./seed.txt /root/nutch/urls/seed.txt
COPY ./crawl /root/nutch/bin/crawl

ENV ES_HOST=elasticsearch \
    ES_PORT=9200 \
    TIME_OUT=120 \
    NUTCH_LOOPS=9999

CMD sh /entrypoint/wait-for ${ES_HOST}:${ES_PORT} -t ${TIME_OUT} -- /root/nutch/bin/crawl -i -s /root/nutch/urls/seed.txt data ${NUTCH_LOOPS}
