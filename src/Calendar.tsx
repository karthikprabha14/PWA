import { useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import './Calendar.css';

export const Calendar: React.FC = () => {

    return (
        <div>
            <h1>Welcome to Calendar</h1>
        </div>
    );

}

export const Organisations: React.FC = () => {
    return (
        <div>
            <h1>Welcome to COURSE</h1>
        </div>
    );
}

interface GradeItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const Grades: React.FC = () => {
    const [grades, setGrades] = useState<GradeItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const isDesktop = useMediaQuery('(min-width:600px)');

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch('https://fakestoreapi.com/products/category/jewelery');
            const data = await response.json();
            setGrades(data);
          } catch (error) {
            console.error('Error fetching products:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProducts();
      }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    function GradeCard({ course }: { course: GradeItem }) {
        return (
            <Card sx={{ maxWidth: '100%', marginBottom: '16px' }}>
                <CardActionArea>
                    <img src={course.image} style={{ height: 140, width: '100%', objectFit: 'cover' }} />
                    <CardContent>
                        <h3>
                            {course.title}
                        </h3>
                        <h5 className="truncate-2-lines">
                            {course.description}
                        </h5>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }

    return (
        <div>
            {isDesktop ? (
                // Desktop layout: Grid view
                <Grid container spacing={2} style={{ padding: 16 }}>
                    {grades.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <GradeCard course={course} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Mobile layout: List view
                <List style={{ padding: 16 }}>
                    {grades.map((course, index) => (
                        <GradeCard course={course} key={index} />
                    ))}
                </List>
            )}
        </div>
    );
}