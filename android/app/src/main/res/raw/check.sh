file=./config.json
if [ -e "$file" ]; then
    echo "File exists"
else
    echo "File does not exist"
    exit 42
fi
