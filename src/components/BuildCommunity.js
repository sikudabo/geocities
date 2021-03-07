import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/CameraAlt';
import swal from 'sweetalert';
import axios from 'axios'; 
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress'; 
import Resizer from 'react-image-file-resizer';
import { SwatchesPicker } from 'react-color';
import { useHistory }  from 'react-router-dom';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        marginTop: 100,
    },
    card: {
        margin: 'auto',
        maxWidth: 450,
    },
    topField: {
        marginTop: 20,
    },
    fieldMarg: {
        marginTop: 30,
    },
    topMarg: {
        marginTop: 10,
    },
    input: {
        display: 'none',
    },
}));

const communityTopics = [
    'Accounting', 'Activism', 'Animals And Pets', 'Art', 'Astrology', 'Athletes', 'Aviation', 'Bars', 'Baseball', 'Beauty And Makeup', 'Biking', 'Black Lives Matter', 'Brands/Products', 'Business', 'Careers', 'Cars And Motor Vehicles', 
    'Celebrity', 'College Baseball', 'College Basketball', 'College Football', 'Computer Science', 'Crafts And DYI', 'Crossfit', 'Crypto', 'Culture Race And Ethnicity', 'Dancing', 'Day Trading', 'Documentaries','Economics',
    'Education', 'Electronics', 'Entertainment', 'Ethics And Philosophy', 'Family And Relationships', 'Fashion', 'Filming', 'Fitness And Nutrition', 'Food And Drink', 'Funny/Humor',
    'Gaming', 'Gender', 'GeoCities', 'Greek Life', 'Hair', 'Health', 'History', 'Hobbies', 'Hockey', 'Home And Garden', 'Investing', 'International Culture', 'Internet Culture', 'Intramural Sports', 'Latin Culture', 'Marijuna', 'Marketplace And Deals',
    'Mature Themes And Adult Content', 'Medical And Mental Health', 'Meditation', "Men's Health", 'Military', 'Movies', 'Music', 'NBA', 'NFL', 'NHL', 'Nursing', 'Only Fans',
    'Outdoors And Nature', 'Partying', 'People', 'Personal Connections', 'Photography', 'Podcasts And Streamers', 'Politics', 'Pop Culture', 'Programming', 'Public Policy', 'Reading Writing And Literature', 
    'Religion And Spirituality', 'Robinhood Trading', 'Rowing', 'Running', 'Science', 'Sexual Health And Orientation', 'Side Hustle', 'Sports', 'Soccer', 'Social Justice', 'Software Engineering', 'Streaming', 'Tabletop Games', 'Television', 'Television Personalities', 'Theatre', 'Track & Field', 'Volleyball',
    "Women's Health", 'World News', 'Working Out/Gym', 'Work/Labor',
];

function BuildCommunity(props) {
    const classes = useStyles(); //Custom styles
    const history = useHistory(); //History API access
    const formRef = useRef(null); //Form reference
    const [name, setName] = useState(''); //State for community name. 
    const [title, setTitle] = useState(''); //State for community title (100 character max).
    const [topics, setTopics] = useState([]); //Community topics.
    const [communityTheme, setCommunityTheme] = useState('#00143C'); //Community theme color. Default to dark blue.
    const [avatar, setAvatar] = useState(null); //Community profile image. 
    const [description, setDescription] = useState(''); //Community description string. 
    const [open, setOpen] = useState(false);
    const regularExpressions = {
        nameExpression: /^\w+$/,
        alphaStartRe: /^[A-Za-z]+$/,
    }; //Regular expressions for a valid community name with letters, numbers, and underscores, along with another regex for the community name to start with a letter.

    useEffect(() => {
        //First, check to see if the user is logged into GeoCities. Redirect them to login page if not. 
        if(props.mainUser === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to build a community!',
                'error',
            );
            history.push('/');
        }
        else {
            props.dispatch({type: 'ThemeChange', payload: props.mainUser.profileTheme}); //Update profile theme.
        }

        //Now add some form validation rules. 
        //Rule that the name (or title) not be empty. 
        ValidatorForm.addValidationRule('nameRequired', v => {
            if(v.trim() === '') {
                return false;
            }
            else {
                return true;
            }
        });

        //Validation rule that the length of a name for a community be between 6 and 30 characters
        ValidatorForm.addValidationRule('nameLength', v => {
            if(v.length < 6) {
                return false;
            }
            else if(v.length > 50) {
                return false;
            }
            else {
                return true;
            }
        });

        //Validation rule that the title of a community be between 10 and 75 characters 
        ValidatorForm.addValidationRule('titleLength', v => {
            if(v.length < 10) {
                return false;
            }
            else if(v.length > 75) {
                return false;
            }
            else {
                return true;
            }
        });

        //The rule below ensures that the name is valid and follows regex rules.
        ValidatorForm.addValidationRule('nameRe', v => {
            if(!regularExpressions.nameExpression.test(v)) {
                return false;
            }
            else {
                return true;
            }
        });

        //The rule below ensures the name starts with an alpha character 
        ValidatorForm.addValidationRule('alphaStart', v => {
            if(!regularExpressions.alphaStartRe.test(v.slice(0, 1))) {
                return false;
            }
            else {
                return true;
            }
        });

        //The rule below ensures that the community description is at least 10 characters and at most 300. 
        ValidatorForm.addValidationRule('descriptionLength', v => {
            if(v.length < 10) {
                return false;
            }
            else if(v.length > 300) {
                return false;
            }
            else {
                return true;
            }
        });
    }, []);

    function preventSpaces(e) {
        //This function prevents spaces in the community name 
        if(e.keyCode === 32) {
            e.preventDefault();
            return false;
        }
    }

    function handleTopicsChange(e) {
        //This function will add topics to the topics array. It will remove the topic if it is unchecked.
        if(e.target.checked) {
            if(topics.length <= 9) {
                setTopics(topics => [...topics, e.target.value]);
            }
            else {
                swal(
                    'Uh Oh!',
                    'You can only select up to 10 topics!',
                    'error',
                );
            }
        }
        else if(!e.target.checked) {
            setTopics(topics.filter(topic => topic !== e.target.value));
        }
    }

    function resizerFunction(file) {
        //This is a wrapper for the file resizer 
        return new Promise(resolve => {
            Resizer.imageFileResizer(
                file,
                600,
                600,
                'JPEG',
                100,
                0,
                uri => {
                    resolve(uri);
                },
                'blob',
            );
        });
    }

    async function handleAvatarChange(e) {
        //This function will handle storing an avatar in the avatar state variable and resizing it. 
        let file = e.target.files[0];
        let resizedAvatar = await resizerFunction(file);
        setAvatar(resizedAvatar);
    }

    async function buildCommunity() {
        setOpen(true);

        let formValid = formRef.current.isFormValid();

        if(!formValid) {
            swal(
                'Uh Oh!',
                'Make sure you filled out the community builder form properly!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(avatar === null) {
            swal(
                'Uh Oh!',
                'Make sure you add a community avatar!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(topics.length < 1) {
            swal(
                'Uh Oh!',
                'You must select at least one relevant topic for this community!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else {
            let fd = new FormData();
            let date = new Date();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let month = months[date.getMonth()];
            let day = date.getDate();
            let year = date.getFullYear();
            let createdOn = `${month} ${day}, ${year}`;
            fd.append('createdOn', createdOn);
            fd.append('username', props.mainUser.username);
            fd.append('uniqueUserId', props.mainUser.uniqueUserId);
            fd.append('name', name);
            fd.append('title', title);
            fd.append('communityTheme', communityTheme);
            fd.append('avatar', avatar, 'avatar.jpg');
            fd.append('description', description);
            fd.append('topics', topics);

            return axios({
                method: 'POST',
                url: 'http://10.162.4.11:3001/api/build/community',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data !== 'error') {
                    swal(
                        'Great!',
                        'Successfully built new community!',
                        'success',
                    );
                    setOpen(false);
                    history.push(`/community/${response.data}`);
                }
                else if(response.data === 'name taken') {
                    swal(
                        'Uh Oh!',
                        'That community name is taken! Please select another',
                        'error',
                    );
                    setOpen(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error building this community! Please try again.',
                        'error',
                    );
                    setOpen(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error building that community!',
                    'error',
                );
                setOpen(false);
            });
        }
    }


    if(props.mainUser !== null) {
        //Return this layout if the user is signed in. 
        return (
            <Grid 
                container 
                className={classes.root}
            >
                <Card 
                    className={classes.card} 
                >
                    <CardContent>
                        <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center' 
                        >
                            Build a GeoCities community!
                        </Typography>
                        <Typography 
                            component='small'
                            className={classes.topMarg} 
                            align='center' 
                        >
                            GeoCities allows you to build interactive communities around topics of interest. As the community builder,
                            you will also be the community moderator. You will have the ability to block or 
                            add users to the community, alter community settings, delete posts and comments, 
                            manage the chatroom, and set community rules. You can also decide if the community 
                            posts should be publicly available or only available to members of the community. 
                            We encourage you to make the community public to enhance engagement amongst community 
                            members. You can NEVER change the name of the community once you select a name.
                        </Typography>
                        <ValidatorForm 
                            ref={formRef}
                            onSubmit={e => e.preventDefault()}
                        >
                            <Typography 
                                variant='body1' 
                                component='p' 
                                color={(name.length < 6 || name.length > 50) ? 'error' : 'default'}
                                style={{
                                    marginTop: 20,
                                }}
                                align='center'
                            >
                                {name.length}/50
                            </Typography>
                            <TextValidator
                                label='Community name'
                                placeholder='Select a community name | e.g. (Colts_Fans_Community)'
                                helperText='The community name must start with a letter and can only contain letters, numbers, and underscores. Community names must be between 6 and 50 characters long and cannot contain spaces. You can NEVER change the name of a community, so make sure you select the proper name!'
                                value={name}
                                onChange={e => setName(e.target.value)}
                                validators={['nameRequired', 'nameLength', 'nameRe', 'alphaStart']}
                                errorMessages={['Must enter a community name!', 'Community name must be between 6 and 50 characters long!', 'Name can only contain letters, numbers, and underscores, and it must start with a letter!', 'Community name must start with a letter!']}
                                onKeyDown={preventSpaces}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant='outlined' 
                                fullWidth
                                required 
                            />
                            <Typography 
                                variant='body1' 
                                component='p'
                                className={classes.toMarg}
                                align='center'
                                color={(title.length < 10 || title.length > 75) ? 'error' : 'default'}
                            >
                                {title.length}/75
                            </Typography>
                            <TextValidator
                                label='Community title'
                                placeholder='Select a title for this community (required)'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                helperText='The community title will display at the top of your community page. This can be a short description of what the community is about and must be between 10 and 75 characters.'
                                validators={['nameRequired', 'titleLength']}
                                errorMessages={['A title for the community is required!', 'The community title must be between 10 and 75 characters!']}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant='outlined'
                                fullWidth
                                required
                            />
                            <FormControl 
                                className={classes.topMarg} 
                                component='fieldset' 
                            >
                                <FormLabel 
                                    component='legend' 
                                >
                                    Select at least 1 community topic. You can choose up to 10 (required)
                                </FormLabel>
                                <FormGroup 
                                    column 
                                >
                                    {communityTopics.map((topic, index) => (
                                        <FormControlLabel 
                                            key={index.toString()}
                                            value={topic}
                                            onChange={handleTopicsChange}
                                            label={topic}
                                            labelPlacement='end' 
                                            control={
                                                <Checkbox 
                                                    color='primary' 
                                                    checked={topics.includes(topic)}
                                                />
                                            }
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <Typography 
                                className={classes.topMarg}
                                variant='body1'
                                component='p'
                                color={(description.length < 10 || description.length > 300) ? 'error' : 'default'}
                                align='center'
                            >
                                {description.length}/300
                            </Typography>
                            <TextValidator 
                                className={classes.topMarg}
                                label='Community description'
                                placeholder='Write a brief this community (required)'
                                helperText='The community description states what the community is about. It must be between 10 and 300 characters!'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                validators={['nameRequired', 'descriptionLength']}
                                errorMessages={['Must enter a community description!', 'The community description must be between 10 and 300 characters long!']}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                variant='outlined'
                                rows={3}
                                multiline={true}
                                required 
                                fullWidth
                            />
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1'
                                component='p' 
                            >
                                Select a theme color for this community!
                            </Typography>
                            <SwatchesPicker 
                                color={communityTheme} 
                                onChange={color => setCommunityTheme(color.hex)} 
                                colors={[
                                    ['#00143C', '#2471A3', '#3498DB'],
                                    ['#641E16', '#C0392B', '#E74C3C'],
                                    ['#0E6655', '#45B39D', '#58D68D'],
                                    ['#5B2C6F', '#8E44AD', '#C39BD3'],
                                    ['#BA4A00', '#DC7633', '#E67E22'],
                                    ['#000000', '#34495E', '#7F8C8D'],
                                ]}
                            />
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1' 
                                component='p'
                            >
                                Select a community avatar picture!
                            </Typography>
                            <label 
                                className={classes.topMarg}
                                html-for='avatar' 
                                style={{
                                    margin: 'auto',
                                }}
                            >
                                <input 
                                    className={classes.input}
                                    id='avatar'
                                    name='avatar' 
                                    type='file'
                                    accept='image/jpeg, image/jpg, image/png'
                                    onChange={handleAvatarChange}
                                    required 
                                />
                                <Button 
                                    component='span'
                                    color='primary' 
                                    variant='contained' 
                                >
                                    <CameraIcon />
                                </Button>
                            </label>
                            <div 
                                style={{
                                    margin: 'auto',
                                    textAlign: 'center',
                                    marginTop: 20,
                                }}
                            >
                                <Button 
                                    variant='contained' 
                                    color='primary' 
                                    onClick={buildCommunity} 
                                    disabled={open}
                                >
                                    {open ? <CircularProgress color='primary' /> : 'Build community'}
                                </Button>
                            </div>
                        </ValidatorForm>
                    </CardContent>
                </Card>
            </Grid>
        )
    }
    else {
        //If the mainUser is null, simply return a circular progress until we load the user, or redirect to the log in page. 
        <Backdrop 
            open={true} 
        >
            <CircularProgress 
                color='primary' 
            />
        </Backdrop>
    }
}

function mapStateToProps(state) {
    return {
        mainUser: state.userReducer.user,
        primary: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(BuildCommunity);