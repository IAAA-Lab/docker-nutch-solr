FROM apache/nutch:release-1.14

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64

COPY ./nutch-site.xml ./regex-urlfilter.txt /root/nutch/conf/

COPY ./seed.txt /root/nutch/urls/seed.txt

CMD /root/nutch/bin/crawl -i -s /root/nutch/urls/seed.txt data 9999
