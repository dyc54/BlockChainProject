
# Blockchain Medical Supply Chain System

## Introduction

This project is a Blockchain Medical Supply Chain System designed to enhance the traceability and authenticity of medical supplies from production to consumption. By utilizing Hyperledger Fabric, we ensure a decentralized, secure, and transparent supply chain management platform tailored for the medical industry.

## Technical Framework

- **Frontend**: React
- **Backend**: Spring Boot
- **Blockchain**: Hyperledger Fabric 2.54

## Getting Started

### Prerequisites

- Node.js and npm
- Java JDK 17
- Maven
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:

```sh
git clone https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-3900m09aswordnewnew.git
```

2. Install the frontend dependencies:

```sh
cd frontend
npm install
```

3. Install the backend dependencies:

```sh
cd backend
mvn install
```

4. Set up the Hyperledger Fabric network:

```sh
cd Blockchain
sudo bash generate.sh
sudo bash deploy.sh
```

generate.sh is used to generate channel-artifacts

deploy.sh is used to create channel, join channel, update the anchor peer and a series of chain code deployment operations.

(the binary file in our project is based on linux-amd64. If you use the mac os, you need to downloads the correct version file and change the /bin /builders /config file in the Blockchain https://github.com/hyperledger/fabric/releases)

For more specific deployment issues,you can see the md file "BlockchainDeploy.md".If you still can not resolve the problem, please contact us;[z5307190@ad.unsw.edu.au].

### Running the Application

1. Start the backend server:

```sh
cd backend
mvn spring-boot:run
```

2. Run the frontend application:

```sh
cd frontend
npm start
```

Run it locally, otherwise there will be slow responses or lags.

3. Run the Blockchain network

If you have successfully deployed the chaincode then the blockchain network should now be open, if you want to open it next time just use

```sh
docker-compose up -d
```

in the Blockchain directory.


The React application should now be running on [http://localhost:3000](http://localhost:3000), and the Spring Boot application on [http://localhost:8080](http://localhost:8080).

## Contact Us for Support

If you encounter any deployment or command issues, please email us for consultation[z5307190@ad.unsw.edu.au].


## Contributing

This is a private project and we have completed the development phase. However, if you have questions or would like to learn more about the project, please feel free to contact us via the email addresses provided below[Email Address].


## Authors

- **Guangyuan Ma** - *Blockchain and backend* - [Guangyuan](https://github.com/Noplusultra)
- **Yuchuan Deng** - *Blockchain and backend* - [Yuchuan](https://github.com/dyc54)
- **Haotian Luo** - *Frontend* - [Haotian](https://github.com/Haotian14)
- **Weihou Zeng** - *Backend* - [Weihou](https://github.com/PeterZG)


See also the list of [contributors](https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-3900m09aswordnewnew/graphs/contributors) who participated in this project.

If the link [contributors](https://github.com/unsw-cse-comp3900-9900-23T3/capstone-project-3900m09aswordnewnew/graphs/contributors) here is unsuccessful, please click on the 'Contributors' button on the right side of our project homepage for more information.


## License

Currently, this project is not under any specific open source license.


## Email Address

- Glenn Deng - z5362100 - z5362100@ad.unsw.edu.au - Developer & Scrum Master
- Haotian Luo - z5341069 - z5341069@ad.unsw.edu.au - Developer
- Weihou Zeng - z5270202 - z5270202@ad.unsw.edu.au - Developer
- Guangyuan Ma - z5307190 - z5307190@ad.unsw.edu.au - Developer


## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc

---

**Note**: Replace `[repository-url]` with the actual URL of your repository.
