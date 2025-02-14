import { useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import './Courses.css';

interface CourseItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

function Courses() {
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const isDesktop = useMediaQuery('(min-width:600px)');

    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            setCourses(data);
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

    function CourseCard({ course }: { course: CourseItem }) {
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
                    {courses.map((course, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CourseCard course={course} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Mobile layout: List view
                <List style={{ padding: 16 }}>
                    {courses.map((course, index) => (
                        <CourseCard course={course} key={index} />
                    ))}
                </List>
            )}
        </div>
    );
}

export default Courses;