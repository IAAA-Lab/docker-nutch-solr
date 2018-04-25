FROM apache/nutch:release-1.13

COPY ./nutch-site.xml /root/nutch/conf/nutch-site.xml 
COPY ./regex-urlfilter.txt /root/nutch/conf/regex-urlfilter.txt 
COPY ./seed.txt /root/nutch/urls/seed.txt
ENV JAVA_HOME="/usr/lib/jvm/java-7-oracle"
