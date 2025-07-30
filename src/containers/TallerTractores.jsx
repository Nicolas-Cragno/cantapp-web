import './css/Sections.css';
import Reparaciones from './sub-containers/Reparaciones';

const TallerTractores = () => {
    return (
        <section className='section-containers'>
                <Reparaciones subArea="tractores"></Reparaciones>
        </section>
    );
};

export default TallerTractores;