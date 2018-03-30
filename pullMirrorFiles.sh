#!/bin/sh

curl http://central.maven.org/maven2/us/springett/nist-data-mirror/1.1.0/nist-data-mirror-1.1.0.jar > nist-data-mirror.jar
mkdir mirror
java -jar nist-data-mirror.jar mirror

rm mirror/nvdcve-*.json
rm mirror/nvdcve-*.xml
rm mirror/nvdcve-200*
rm mirror/nvdcve-2.0-200*
