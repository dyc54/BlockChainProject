#!/bin/bash

docker-compose up -d

# create channel
docker exec cli.hospital peer channel create -o orderer.example.com:7050 -c mychannel --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt  -f ./channel-artifacts/mychannel.tx
#hospital join channel
sleep 5
docker exec cli.hospital peer channel join -b mychannel.block
docker exec cli.hospital peer channel list
echo "hospital join channel success"

#copy channel block to supplier and patient
docker cp cli.hospital:/opt/gopath/src/github.com/hyperledger/fabric/peer/mychannel.block ./
docker cp mychannel.block cli.supplier:/opt/gopath/src/github.com/hyperledger/fabric/peer
docker cp mychannel.block cli.patient:/opt/gopath/src/github.com/hyperledger/fabric/peer

#supplier join channel
docker exec cli.supplier peer channel join -b mychannel.block
docker exec cli.supplier peer channel list
echo "supplier join channel success"

#patient join channel
docker exec cli.patient peer channel join -b mychannel.block
docker exec cli.patient peer channel list
echo "patient join channel success"

#update anchor peer

docker exec cli.hospital peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/HospitalMSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec cli.supplier peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/SupplierMSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec cli.patient peer channel update -o orderer.example.com:7050 -c mychannel -f ./channel-artifacts/PatientMSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


#package chaincode

CCN=mychaincode8

CURRENT_DIR=$(pwd)

# add bin to PATH
export PATH=$CURRENT_DIR/bin:$PATH

# set fabric config path
export FABRIC_CFG_PATH=$CURRENT_DIR/config

peer lifecycle chaincode package "$CCN.tar.gz" --path ./chaincode --lang  node --label "$CCN"

docker cp "$CCN.tar.gz" cli.hospital:/opt/gopath/src/github.com/hyperledger/fabric/peer
docker cp "$CCN.tar.gz" cli.supplier:/opt/gopath/src/github.com/hyperledger/fabric/peer
docker cp "$CCN.tar.gz" cli.patient:/opt/gopath/src/github.com/hyperledger/fabric/peer

#install chaincode

docker exec cli.hospital peer lifecycle chaincode install "$CCN.tar.gz" >& install_output.txt
OUTPUT=$(cat install_output.txt)

PACKAGE_ID=$(echo "$OUTPUT" | grep -oP "Chaincode code package identifier: \K\S+")

echo "Package ID: $PACKAGE_ID"


docker exec cli.supplier peer lifecycle chaincode install "$CCN.tar.gz"

docker exec cli.patient peer lifecycle chaincode install "$CCN.tar.gz"


#approve chaincode

docker exec cli.hospital peer lifecycle chaincode queryinstalled
docker exec cli.hospital peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "$CCN" --version 1.0 --package-id "$PACKAGE_ID" --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec cli.supplier peer lifecycle chaincode queryinstalled
docker exec cli.supplier peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "$CCN" --version 1.0 --package-id "$PACKAGE_ID" --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec cli.patient peer lifecycle chaincode queryinstalled
docker exec cli.patient peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "$CCN" --version 1.0 --package-id "$PACKAGE_ID" --sequence 1 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


#check commitreadiness
docker exec cli.supplier peer lifecycle chaincode checkcommitreadiness \
--channelID mychannel \
--name "$CCN" \
--version 1.0 \
--sequence 1 \
--tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

#commit chaincode

docker exec cli.supplier peer lifecycle chaincode commit -o orderer.example.com:7050 \
--ordererTLSHostnameOverride orderer.example.com \
--channelID mychannel \
--name "$CCN" --version 1.0 \
--sequence 1 \
--tls \
--cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem \
--peerAddresses peer0.supplier.example.com:7051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/ca.crt \
--peerAddresses peer0.hospital.example.com:9051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/hospital.example.com/peers/peer0.hospital.example.com/tls/ca.crt \
--peerAddresses peer0.patient.example.com:11051 \
--tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/peers/peer0.patient.example.com/tls/ca.crt

docker exec cli.supplier peer chaincode invoke -o orderer.example.com:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name "$CCN" --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel --peerAddresses peer0.supplier.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/ca.crt --peerAddresses peer0.hospital.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/hospital.example.com/peers/peer0.hospital.example.com/tls/ca.crt --peerAddresses peer0.patient.example.com:11051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/patient.example.com/peers/peer0.patient.example.com/tls/ca.crt -c '{"function":"InitLedger", "Args":[]}'

echo "chaincode deployed successfully!"