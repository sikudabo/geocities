import React from 'react';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/StarBorder';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles } from '@material-ui/core/styles';
import Simeon from '../site-images/simeon.jpg';
import Jessica from '../site-images/jessica.jpg';
import Meghan from '../site-images/meghan.jpg';
import Marcoleno from '../site-images/marcoleno.jpg';
import Dat from '../site-images/dat.jpg';
import Abbey from '../site-images/abbey.jpg';

const useStyles = makeStyles((theme) => ({
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    img: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
}));

const people = [
    {
        name: 'Simeon',
        by: 'Simeon Ikudabo',
        img: Simeon,
    },
    {
        name: 'Abbey',
        by: 'Abbey Fisher',
        img: Abbey,
    },
    {
        name: 'Marcoleno',
        by: 'Marcoleno Ball',
        img: Marcoleno,
    },
    {
        name: 'Jessica',
        by: 'Jessica Dub',
        img: Jessica,
    },
    {
        name: 'Dat',
        by: 'Dat Thomas',
        img: Dat,
    },
    {
        name: 'Meghan',
        by: 'Meghan Gulvas',
        img: Meghan,
    },
];

export default function GridListExample() {
    const classes = useStyles();

    return (
        <Grid 
            container 
            xl 
        >
            <Grid 
                item 
                xs={12} 
            >
                <GridList
                    cols={3} 
                    rows={2}
                    className={classes.gridList}
                >
                    {people.map((p, index) => {
                        return (
                            <GridListTile 
                                cols={1}
                            >
                                <img 
                                    alt={p.name} 
                                    src={p.img} 
                                    title={p.name}
                                    className={classes.img}
                                    
                                />
                                <GridListTileBar 
                                    title={p.name} 
                                    subtitle={`By: ${p.by}`}
                                    actionIcon={
                                        <IconButton 
                                            style={{
                                                color: 'rgb(255, 255, 255)',
                                            }}
                                        >
                                            <StarIcon />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        );
                    })}
                </GridList>
            </Grid>
        </Grid>
    );
}
