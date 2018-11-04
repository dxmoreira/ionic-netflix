# APP Ionic 'Clone da Netflix' utilizando o The Movie Database

Para baixar o repositório:

```bash
git clone https://github.com/dxmoreira/ionic-netflix.git
```
Em seguida, acesse o diretório e instale as dependências:

```bash
cd ionic-netflix/
npm install
```

## Inicie o aplicativo no navegador

Para iniciar o aplicativo, exibindo no navegador:

*Nota: Recomendo utilizar a ferramenta de desenvolvimento de navegador (F12), na exibição do dispositivo móvel.

```bash
npm start
```

Para experimentar diferentes visualizações fornecidas pelo Ionic de acordo com a plataforma em que o aplicativo é executado, execute o comando no terminal:

```bash
ionic serve --lab
```

## Inicie o aplicativo nativamente 

Para iniciar o aplicativo no modo de desenvolvimento para executar nativamente no Android ou no iOS, você deve ter instalado o SDK e alguns extras. Você pode consultar a documentação correspondente [aqui] (https://ionicframework.com/docs/intro/deploying/).

Depois de ter os requisitos instalados, você deve executar os seguintes comandos:

```bash
#Para dispositivos Android
ionic cordova run android --prod --release
```

```bash
#Para dispositivos iOS
ionic cordova run ios --device
```

## Autor
[Douglas Moreira](https://github.com/dxmoreira)