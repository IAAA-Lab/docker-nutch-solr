FROM alpine:latest

RUN apk add --no-cache curl

WORKDIR /app

RUN curl https://raw.githubusercontent.com/eficode/wait-for/master/wait-for -o /app/wait-for && \
      chmod +x /app/wait-for

COPY init-elastic /app/

RUN chmod +x /app/init-elastic

ENV ES_HOST=localhost \
    ES_PORT=9200 \
    TIME_OUT=30

CMD sh /app/wait-for ${ES_HOST}:${ES_PORT} -t ${TIME_OUT} -- /app/init-elastic
