## Assume you are using the windows

you need to use:

- a linux sub-system(wsl)
- docker desktop application

1.

```sh

https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-3900m09aswordnewnew.git

```

2.

change to the /Blockchain folder

3.
```sh
sudo bash generate.sh
```

If nothing error, you need to open the docker desktop application and then change the hosts file

In the /etc directory on your computer(the location depends on your computer), there is a hosts file, modify it by adding at the end of the

127.0.0.1 peer0.supplier.example.com
127.0.0.2 peer0.hospital.example.com
127.0.0.3 peer0.patient.example.com

then save.

```sh
sudo bash deploy.sh
```

If no errors are reported and the status of the last initialization shows 200 proves that the blockchain network has been successfully deployed.
If you encounter any unsolvable problems or can't get it to start successfully, please contact us

z5307190@ad.unsw.edu.au


More attention:
Using a linux virtual machine or other environment is similar to this, but note that we don't support operating with a unix system such as a mac. 
Because our built-in hyperledger fabric binary is based on amd64, it may be different depending on the architecture.