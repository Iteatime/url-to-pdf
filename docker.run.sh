#/bin/bash

echo "### Running application ###"
docker run -it --rm -v "$(pwd)":/app -w /app --name pdf-service -p  8080:8080 pdf-service:1 sh -c "API_KEY=$1 npm run dev"