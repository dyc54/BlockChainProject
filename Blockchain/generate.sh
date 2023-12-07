#!/bin/bash

# Define the output directory for artifacts
ARTIFACTS_DIR="./channel-artifacts"

export PATH=$PATH:$(pwd)/bin
export FABRIC_CFG_PATH=$PATH:$(pwd)/config

# Ensure the artifacts directory exists
mkdir -p $ARTIFACTS_DIR

# Generate the genesis block for system channel
configtxgen -profile ThreeOrgsApplicationGenesis -outputBlock $ARTIFACTS_DIR/genesis.block -channelID system-channel

# Generate the channel transaction
configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx $ARTIFACTS_DIR/mychannel.tx -channelID mychannel

# Generate anchor peer update for HospitalMSP
configtxgen -profile ThreeOrgsChannel -channelID mychannel -asOrg HospitalMSP -outputAnchorPeersUpdate $ARTIFACTS_DIR/HospitalMSPanchors.tx

# Generate anchor peer update for PatientMSP
configtxgen -profile ThreeOrgsChannel -channelID mychannel -asOrg PatientMSP -outputAnchorPeersUpdate $ARTIFACTS_DIR/PatientMSPanchors.tx

# Generate anchor peer update for SupplierMSP
configtxgen -profile ThreeOrgsChannel -channelID mychannel -asOrg SupplierMSP -outputAnchorPeersUpdate $ARTIFACTS_DIR/SupplierMSPanchors.tx

# Print completion message
echo "Configtxgen operations completed successfully!"
