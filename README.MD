# NIST Data Mirror

Builds a mirror of the NIST vulnerbility database.

Use the mirrored data for faster scans with [OWASP Dependency-Check](https://www.owasp.org/index.php/OWASP_Dependency_Check)  to check for known dependency vulnerabilities.

Inspired by https://github.com/stevespringett/nist-data-mirror

## Usage

1. Run the node app to fetch data from NIST
```
npm install
npm start
```

2. Host the data using Docker Nginx
```
docker build -t local/nist-mirror:latest .
docker run -ti -p 8080:80 local/nist-mirror:latest
```

3. Check it from your browser
```
http://localhost:8080/nvdcve-1.0-2018.json
```

## Update the mirror
Running the script again will refresh the mirror data. You may also wish to limit data years range of data to get by editing the `index.js` script.

## Use the mirror

### Maven dependency check plugin

The Dependency check has support for a number of build tools, see https://jeremylong.github.io/DependencyCheck/

If you use Maven, here are the Maven plugin configs to make use of the mirror (replace with your hostname)

```
<plugin>
    <groupId>org.owasp</groupId>
    <artifactId>dependency-check-maven</artifactId>
    <version>3.1.1</version>
    <configuration>
    <cveUrl12Modified>http://localhost:8080/nvdcve-modified.xml.gz</cveUrl12Modified>
    <cveUrl20Modified>http://localhost:8080/nvdcve-2.0-modified.xml.gz</cveUrl20Modified>
    <cveUrl12Base>http://localhost:8080/nvdcve-%d.xml.gz</cveUrl12Base>
    <cveUrl20Base>http://localhost:8080/nvdcve-2.0-%d.xml.gz</cveUrl20Base>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>check</goal>
            </goals>
        </execution>
    </executions>
</plugin>

```

It should run on `mvn verify` phase by default. You may also trigger it using:
```
mvn org.owasp:dependency-check-maven:3.1.1:check
```
