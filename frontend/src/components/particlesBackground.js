import React from "react";
import Particles from "react-particles";
import particleConfig from "./config/particlesjs-config";
import { loadFull } from "tsparticles";


function ParticleBackground () {

    async function loadParticles(main){
        await loadFull(main);
    }

    return(

        <Particles 
        id = 'tsparticles'
        init = {loadParticles}

        options = {particleConfig}
        />
    );
};

export default ParticleBackground;
