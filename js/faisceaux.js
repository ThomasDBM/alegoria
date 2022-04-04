        // Dirty little functions to show rays from ground points to camera through image
       function showFaisceaux(){
            var source = new FetchSource('data/');

            source.open('MesuresAppuis-S2D.xml', 'text').then(
                function(data){
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(data,"text/xml");
                    var g = xmlToJson(xmlDoc);//JSON.stringify(data));
                    console.log(g);

                    // We load the second file of ground points
                    var sourceG = new FetchSource('data/');
                    sourceG.open('appuis.xml', 'text').then(
                        function(dataG){
                            xmlDocG = parser.parseFromString(dataG,"text/xml");
                            var g2 = xmlToJson(xmlDocG);//JSON.stringify(data));
                            console.log(g2);

                            // We draw spheres on points appuis
                            var pG = g2.DicoAppuisFlottant.OneAppuisDAF;
                            for(var i = 0; i < pG.length; ++i){
                                var imageNameCurrent = "";
                                var coordAssociatedCamera;
                                var pos = pG[i].Pt["#text"].split(" "); //.split(" ");
                                //console.log(pos);
                                var coord = new itowns.Coordinates('EPSG:2154', parseFloat(pos[0]), parseFloat(pos[1]), parseFloat(pos[2]));
                                var coordInSys = coord.as(view.referenceCrs);
                                //  console.log(pos, coordInSys);
                                var namePt = pG[i].NamePt["#text"];
                               // console.log(namePt);

                                var mesAppuis = g.SetOfMesureAppuisFlottants.MesureAppuiFlottant1Im;
                                for(var j =0; j < mesAppuis.length; ++j){
                                    //console.log(mesAppuis[j]);
                                    var keys = Object.keys( mesAppuis[j].NameIm );
                                    var nameImage2 = mesAppuis[j].NameIm[keys[0]];//mesAppuis[j].NameIm;

                                    // When we encounter the good id of ground point we save image name and look the the right camera
                                    var allMeasures = mesAppuis[j].OneMesureAF1I;
                                    for(var k = 0; k < allMeasures.length; ++k){
                                        var namePtLocal = allMeasures[k].NamePt["#text"];
                                        //console.log(namePtLocal);
                                        if(namePtLocal == namePt){
                                            imageNameCurrent = nameImage2;
                                           // console.log("imageNameCurrent",imageNameCurrent);
                                            var cutNameCurrent = imageNameCurrent.substring(imageNameCurrent.indexOf(".tif") -12, imageNameCurrent.indexOf(".tif") );
                                            // We then need to associate the good camera
                                            var sceneCAMS = sceneAllCams.children;
                                            for(var z = 0; z < sceneCAMS.length; ++z){
                                                //console.log("sceneCAMS.name", sceneCAMS[z].name);
                                                var cutName = sceneCAMS[z].name.substring(sceneCAMS[z].name.indexOf(".jp2") -12, sceneCAMS[z].name.indexOf(".jp2") );
                                                //console.log(cutName);
                                                if (cutName == cutNameCurrent){
                                                    coordAssociatedCamera = sceneCAMS[z].position;
                                                    console.log("aaaaaaaaaaaaaaaaaaaaaaa", cutName, coordAssociatedCamera);
                                                }

                                            }
                                        }
                                    }
                                    //console.log(nameImage2);
                                }
                                // Super ugly: we now look to associate the namePT tothe image in the previous xml loaded

                                // position of cam for ray: coordAssociatedCamera

                                // Draw sphere at pos
                                var geometry = new itowns.THREE.SphereGeometry( 10, 6, 6 );
                                var col = new itowns.THREE.Color(0XFFFF00);
                                var material = new itowns.THREE.MeshBasicMaterial( {color: new itowns.THREE.Color(0XFF0000), transparent:true, opacity:0.8} );
                                var sphere = new itowns.THREE.Mesh( geometry, material );
                                sphere.position.set(coordInSys.x, coordInSys.y, coordInSys.z); //console.log(sphere.position);
                                sphere.updateMatrixWorld();
                                view.scene.add( sphere );


                                // RAY
                                var material = new THREE.LineBasicMaterial({
                                    color: 0x0000ff
                                });

                                var geometry = new THREE.Geometry();
                                geometry.vertices.push(
                                    coordAssociatedCamera,
                                    sphere.position
                                );

                                var line = new THREE.Line( geometry, material );
                                view.scene.add( line );


                            }
                            view.notifyChange();
                        }
                    );
                }
            );
            console.log("sceneAllCams", sceneAllCams);
        }
