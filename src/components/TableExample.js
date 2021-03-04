import React from 'react';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow'; 
import TableCell from '@material-ui/core/TableCell'; 
import Paper from '@material-ui/core/Paper';

const data = [
    {
        name: 'yogart',
        calories: 151,
        fat: 22,
        carbs: 91,
        protein: 97,
    },
    {
        name: 'pizza',
        calories: 341,
        fat: 900,
        carbs: 200,
        protein: 7,
    },
    {
        name: 'hamburger',
        calories: 972,
        fat: 749,
        carbs: 672,
        protein: 28,
    },
    {
        name: 'carrot',
        calories: 928,
        fat: 7,
        carbs: 792,
        protein: 29,
    },
];

export default function TableExample() {
    return (
        <Grid 
            container 
        >
            <Grid 
                item 
                xs={12} 
            >
                <TableContainer 
                    component={Paper} 
                    elevation={2} 
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Food Name
                                </TableCell>
                                <TableCell>
                                    Calories 
                                </TableCell>
                                <TableCell>
                                    Fat (G)
                                </TableCell>
                                <TableCell>
                                    Carbs (G)
                                </TableCell>
                                <TableCell>
                                    Protein (G)
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((element, index) => {
                                return (
                                    <TableRow
                                        key={index.toString()} 
                                    >
                                        <TableCell>
                                            {element.name}
                                        </TableCell>
                                        <TableCell>
                                            {element.calories}
                                        </TableCell>
                                        <TableCell>
                                            {element.fat}
                                        </TableCell>
                                        <TableCell>
                                            {element.carbs}
                                        </TableCell>
                                        <TableCell>
                                            {element.protein}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );
}
