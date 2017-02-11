ssh-keygen -F github.com 2>/dev/null 1>/dev/null
if ! [ $? -eq 0 ]; then
    ssh-keyscan -t rsa github.com > github.pub
    if ! ssh-keygen -lf github.pub | grep -q "16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48"; then
        rm github.pub
        echo "Fingerprint mismatching"
        exit 2
    fi

    cat github.pub >> ~/.ssh/known_hosts
    ssh-keygen -Hf ~/.ssh/known_hosts
    
    rm github.pub
fi

chmod 500 deploy_rsa
ssh-agent bash -c "ssh-add deploy_rsa; git clone git@github.com:delold/nwpos"