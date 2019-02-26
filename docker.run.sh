#/bin/bash

echo "### Running application ###"
docker run -it --rm -v "$(pwd)":/app -w /app --name url-to-pdf -p  8080:8080 url-to-pdf:1 sh -c "PDF_API_KEY=$1 npm run dev"