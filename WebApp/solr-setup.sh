echo "--- setting up solr server ---"
docker container kill newsolr
docker container rm newsolr

docker run -d -v "$PWD/../Data/version 3/:/data/" -p 8983:8983 --name newsolr solr:8.8

docker exec -it newsolr solr create_core -c review_table

docker exec -it newsolr solr create_core -c product_table

curl -X POST -H 'Content-type:application/json' --data-binary '{
  "add-copy-field":{
     "source":"*",
     "dest":"_text_"}
}' http://localhost:8983/solr/review_table/schema

curl -X POST -H 'Content-type:application/json' --data-binary '{
  "add-copy-field":{
     "source":"*",
     "dest":"_text_"}
}' http://localhost:8983/solr/product_table/schema

docker exec -it newsolr post -c product_table /data/product_lists.csv

docker exec -it newsolr post -c review_table /data/review_table_edited.csv

echo "--- solr server is up. ---"