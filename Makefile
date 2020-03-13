up:
	docker-compose up

build:
	docker build -t pacokwon/jjb-node ./api
	docker build -t pacokwon/jjb-react ./client

upd:
	docker-compose up -d

down:
	docker-compose down
