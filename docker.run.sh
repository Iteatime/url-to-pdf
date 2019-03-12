#/bin/bash

echo "### Running application ###"
docker run -it --rm -v "$(pwd)":/app -w /app --name url-to-pdf -p 8080:8080 --entrypoint "npm" url-to-pdf:1 run dev