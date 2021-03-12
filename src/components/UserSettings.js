import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { validatorForm, textValidator } from 'react-material-ui-form-validator';
import axios from 'axios';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import { SwatchesPicker } from 'react-color';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const myCities = ["Abbeville","Aberdeen","Abilene","Abingdon","Abington","Acoma","Ada","Adams","Adrian","Aiken","Ajo","Akron","Alameda","Alamogordo","Alamosa","Albany","Albert Lea","Albuquerque","Alcoa","Alexander City","Alexandria","Alhambra","Aliquippa","Allentown","Alliance","Alma","Alpine","Alta","Alton","Altoona","Altus","Alva","Amana Colonies","Amarillo","Ambridge","American Fork","Americus","Ames","Amesbury","Amherst","Amsterdam","Anaconda","Anacortes","Anadarko","Anaheim","Anchorage","Andalusia","Anderson","Andersonville","Andover","Ann Arbor","Annapolis","Anniston","Ansonia","Antioch","Apalachicola","Appleton","Arcadia","Ardmore","Arkadelphia","Arkansas City","Arkansas Post","Arlington","Arlington Heights","Artesia","Arthur","Asbury Park","Asheboro","Asheville","Ashland","Ashtabula","Aspen","Astoria","Atchison","Athens","Athol","Atlanta","Atlantic City","Atmore","Attleboro","Auburn","Augusta","Aurora","Austin","Avondale","Babylon","Bainbridge","Baker City","Bakersfield","Baltimore","Bangor","Bar Harbor","Baraboo","Barberton","Barbourville","Bardstown","Barnstable","Barre","Barrington","Barstow","Bartlesville","Bartow","Bastrop","Batavia","Batesville","Bath","Baton Rouge","Battle Creek","Bay City","Bay Saint Louis","Bayonne","Baytown","Beacon","Beatrice","Beaufort","Beaumont","Beaverton","Beckley","Bedford","Belen","Belfast","Belle Fourche","Belle Glade","Bellefontaine","Belleville","Bellevue","Bellingham","Bellows Falls","Belmont","Beloit","Belvidere","Bemidji","Bend","Bennington","Benton","Benton Harbor","Berea","Berkeley","Berlin","Bessemer","Bethany","Bethesda-Chevy Chase","Bethlehem","Beverly","Beverly Hills","Biddeford","Big Spring","Billings","Biloxi","Binghamton","Birmingham","Bisbee","Bismarck","Blackfoot","Blairsville","Bloomfield","Bloomfield Hills","Bloomington","Bloomsburg","Bluefield","Blytheville","Boca Raton","Bogalusa","Boise","Bonners Ferry","Boone","Boonesborough","Boonville","Boothbay Harbor","Bordentown","Borger","Bossier City","Boston","Boulder","Boulder City","Bound Brook","Bountiful","Bourne","Bowie","Bowling Green","Boys Town","Bozeman","Bradenton","Bradford","Brainerd","Braintree","Branford","Branson","Brattleboro","Brea","Breckenridge","Bremerton","Bridgeport","Bridgeton","Brigham City","Brighton","Bristol","Brockton","Bronx","Brookfield","Brookings","Brookline","Brooklyn","Brownsville","Brunswick","Bryan","Buckhannon","Buena Park","Buffalo","Burbank","Burlington","Burns","Butte","Cadillac","Cahokia","Cairo","Calais","Caldwell","Calexico","Calhoun","Calistoga","Calumet City","Cambridge","Camden","Campbellsville","Canon City","Canton","Canyon","Cape Coral","Cape Girardeau","Cape May","Carbondale","Caribou","Carlinville","Carlisle","Carlsbad","Carmel","Carrollton","Carson City","Carthage","Casa Grande","Casper","Castine","Catonsville","Cedar City","Cedar Falls","Cedar Rapids","Central City","Central Falls","Centralia","Chadron","Chambersburg","Champaign","Chandler","Chanute","Chapel Hill","Charles City","Charles Town","Charleston","Charlestown","Charlevoix","Charlotte","Charlottesville","Chattanooga","Chautauqua","Cheboygan","Cheektowaga","Chelmsford","Chelsea","Cherokee","Chesapeake","Chester","Cheyenne","Chicago","Chicago Heights","Chickasaw","Chickasha","Chico","Chicopee","Chillicothe","Chula Vista","Cicero","Cincinnati","Clanton","Claremont","Claremore","Clarksburg","Clarksdale","Clarksville","Clayton","Clearfield","Clearwater","Cleburne","Cleveland","Cleveland Heights","Clifton","Climax","Clinton","Clovis","Cocoa Beach","Cocoa-Rockledge","Cody","Coeur d’Alene","Coffeyville","Cohasset","Cohoes","College Park","College Station","Collinsville","Colorado Springs","Columbia","Columbus","Compton","Concord","Coney Island","Conneaut","Connersville","Conway","Cookeville","Cooperstown","Coos Bay","Coral Gables","Cordova","Corinth","Corning","Corona","Coronado","Corpus Christi","Cortez","Cortland","Corvallis","Corydon","Costa Mesa","Coulee Dam","Council Bluffs","Council Grove","Coupeville","Coventry","Covington","Cranford","Cranston","Crawfordsville","Cripple Creek","Crookston","Crossett","Crown Point","Crystal City","Cullman","Culver City","Cumberland","Cushing","Custer","Cuyahoga Falls","Dahlonega","Dallas","Dalton","Daly City","Danbury","Danvers","Danville","Darien","Darlington","Dartmouth","Davenport","Davis","Dayton","Daytona Beach","De Land","De Smet","DeKalb","Deadwood","Dearborn","Decatur","Dedham","Deerfield Beach","Defiance","Del Rio","Delaware","Delray Beach","Delta","Deming","Demopolis","Denison","Dennis","Denton","Denver","Derby","Derry","Des Moines","Des Plaines","Detroit","Devils Lake","Dickinson","Dillon","Dixon","Dodge City","Dothan","Douglas","Dover","Downey","Dubuque","Duluth","Duncan","Dunkirk","Durango","Durant","Durham","Duxbury","Eagle Pass","East Aurora","East Chicago","East Cleveland","East Greenwich","East Hampton","East Hartford","East Haven","East Lansing","East Liverpool","East Moline","East Orange","East Point","East Providence","East Saint Louis","Eastchester","Eastham","Easton","Eastpointe","Eastport","Eau Claire","Ecorse","Edenton","Edgartown","Edinburg","Edison","Edmond","Effingham","El Centro","El Cerrito","El Dorado","El Monte","El Paso","El Reno","Elgin","Elizabeth","Elizabeth City","Elizabethton","Elizabethtown","Elk City","Elkhart","Elkins","Elko","Elkton","Ellensburg","Ellsworth","Elmhurst","Elmira","Elwood","Ely","Elyria","Emmitsburg","Emporia","Enfield","Englewood","Enid","Enterprise","Ephrata","Erie","Escanaba","Escondido","Essex","Estes Park","Estherville","Euclid","Eufaula","Eugene","Eureka","Evanston","Evansville","Eveleth","Everett","Excelsior Springs","Exeter","Fairbanks","Fairfax","Fairfield","Fairhaven","Fairmont","Fall River","Fallon","Falls Church","Falmouth","Fargo","Faribault","Farmington","Fayetteville","Fergus Falls","Ferguson","Fernandina Beach","Fillmore","Findlay","Fitchburg","Fitzgerald","Flagstaff","Flint","Florence","Florissant","Flushing","Fond du Lac","Fontana","Forest Hills","Forrest City","Fort Benton","Fort Collins","Fort Dodge","Fort Kent","Fort Lauderdale","Fort Lee","Fort Morgan","Fort Myers","Fort Payne","Fort Pierce","Fort Scott","Fort Smith","Fort Valley","Fort Walton Beach","Fort Wayne","Fort Worth","Framingham","Frankfort","Franklin","Frederick","Fredericksburg","Fredonia","Freeport","Fremont","French Lick","Fresno","Fullerton","Fulton","Gadsden","Gaffney","Gainesville","Galena","Galesburg","Gallatin","Gallipolis","Gallup","Galveston","Garden City","Garden Grove","Gardiner","Garland","Gary","Gastonia","Gatlinburg","Geneva","Genoa","Georgetown","Germantown","Gettysburg","Gila Bend","Gillette","Glassboro","Glen Ellyn","Glendale","Glendive","Glens Falls","Glenview","Glenwood Springs","Globe","Gloucester","Gloversville","Golden","Goldfield","Goldsboro","Goliad","Goshen","Grafton","Grand Forks","Grand Haven","Grand Island","Grand Junction","Grand Rapids","Granite City","Grants","Grants Pass","Grayling","Great Barrington","Great Bend","Great Falls","Great Neck","Greeley","Green Bay","Green River","Greenbelt","Greeneville","Greenfield","Greensboro","Greensburg","Greenville","Greenwich","Greenwood","Grenada","Gretna","Grinnell","Grosse Pointe","Groton","Guilford","Gulfport","Gunnison","Guntersville","Guthrie","Guymon","Hackensack","Haddonfield","Hagerstown","Haines","Halifax","Hallandale Beach","Hamden","Hamilton","Hammond","Hammondsport","Hampton","Hanalei","Hancock","Hannibal","Hanover","Harlan","Harlem","Harlingen","Harmony","Harpers Ferry","Harrisburg","Harrison","Harrodsburg","Hartford","Hartsville","Harwich","Hastings","Hattiesburg","Haverhill","Havre","Hays","Hayward","Hazard","Hazleton","Heber City","Helena","Hempstead","Henderson","Herkimer","Herrin","Hershey","Hialeah","Hibbing","Hickory","High Point","Highland Park","Hillsboro","Hillsborough","Hilo","Hingham","Hinton","Hobart","Hobbs","Hoboken","Hodgenville","Holdenville","Holland","Holly Springs","Hollywood","Holyoke","Homer","Homestead","Honaunau","Honesdale","Honolulu","Hood River","Hope","Hopewell","Hopkinsville","Hoquiam","Hot Springs","Houghton","Houlton","Houma","Houston","Hudson","Hugo","Huntington","Huntington Beach","Huntsville","Huron","Hutchinson","Hyannis","Hyattsville","Hyde Park","Idaho City","Idaho Falls","Ilion","Independence","Indiana","Indianapolis","Indianola","Indio","Inglewood","Interlochen","International Falls","Iowa City","Ipswich","Iron Mountain","Ironwood","Irvine","Irving","Irvington","Ishpeming","Ithaca","Jackson","Jacksonville","Jamestown","Janesville","Jasper","Jeannette","Jefferson City","Jeffersonville","Jersey City","Jim Thorpe","John Day","Johnson City","Johnstown","Joliet","Jonesboro","Jonesborough","Joplin","Junction City","Juneau","Kahului","Kalamazoo","Kalispell","Kanab","Kaneohe","Kankakee","Kansas City","Kapaa","Kaskaskia","Kawaihae","Kearney","Keene","Kellogg","Kelso","Kennebunkport","Kennewick","Kenosha","Kent","Keokuk","Ketchikan","Kettering","Kewanee","Key West","Keyser","Kilgore","Killeen","Kingman","Kingsport","Kingston","Kingsville","Kinston","Kirksville","Kittery","Kitty Hawk","Klamath Falls","Knoxville","Kodiak","Kokomo","Kotzebue","La Crosse","La Grande","La Grange","La Habra","La Junta","La Salle","Lackawanna","Laconia","Lafayette","Laguna Beach","Lahaina","Laie","Lake Charles","Lake City","Lake Forest","Lake Geneva","Lake Havasu City","Lake Oswego","Lake Placid","Lake Wales","Lakehurst","Lakeland","Lakeview","Lakewood","Lamar","Lancaster","Lander","Lansing","Laramie","Laredo","Largo","Las Cruces","Las Vegas","Laurel","Lawrence","Lawton","Layton","Lead","Leadville","Leavenworth","Lebanon","Lehi","Lenox","Leominster","Levittown","Lewes","Lewisburg","Lewiston","Lewistown","Lexington","Liberal","Libertyville","Lima","Lincoln","Lisle","Litchfield","Little Falls","Little Rock","Littleton","Livermore","Livingston","Livonia","Lock Haven","Lockport","Lodi","Logan","Lombard","Lompoc","Long Beach","Long Branch","Longmont","Longview","Lorain","Los Alamos","Los Angeles","Louisville","Loveland","Lovington","Lowell","Lower Southampton","Lubbock","Lubec","Ludington","Ludlow","Lufkin","Lumberton","Lynchburg","Lynn","Machias","Mackinaw City","Macomb","Macon","Madison","Magnolia","Malden","Malibu","Mamaroneck","Manassas","Manchester","Mandan","Manhattan","Manistee","Manitowoc","Mankato","Mansfield","Manti","Marblehead","Marietta","Marinette","Marion","Marlborough","Marquette","Marshall","Martinez","Martins Ferry","Martinsburg","Martinsville","Marysville","Maryville","Mason City","Massena","Massillon","Mattoon","Mayfield","Maysville","McAlester","McAllen","McCook","McKeesport","McKinney","McMinnville","McPherson","Meadville","Medford","Medicine Lodge","Melbourne","Memphis","Menasha","Menlo Park","Menominee","Mentor","Merced","Meriden","Meridian","Mesa","Mesquite","Mexico","Miami","Miami Beach","Michigan City","Middlebury","Middlesboro","Middletown","Midland","Midwest City","Milan","Milbank","Miles City","Milford","Millburn","Milledgeville","Millville","Milton","Milwaukee","Minden","Mineola","Minneapolis","Minot","Mishawaka","Mission","Missoula","Mitchell","Moab","Mobile","Mobridge","Modesto","Moline","Monett","Monmouth","Monroe","Monroeville","Montclair","Monterey","Montgomery","Monticello","Montpelier","Montrose","Moore","Moorhead","Morehead City","Morgan City","Morganton","Morgantown","Morrilton","Morristown","Moscow","Moses Lake","Moundsville","Mount Clemens","Mount Holly","Mount Pleasant","Mount Vernon","Mountain View","Muncie","Mundelein","Murfreesboro","Murray","Muscatine","Muskegon","Muskogee","Myrtle Beach","Mystic","Nacogdoches","Nags Head","Nahant","Nampa","Nanticoke","Naperville","Naples","Nappanee","Narragansett","Nashua","Nashville","Natchez","Natchitoches","Natick","Naugatuck","Nauvoo","Nebraska City","Needles","Neenah","Neosho","Nephi","New Albany","New Bedford","New Bern","New Braunfels","New Britain","New Brunswick","New Castle","New Glarus","New Harmony","New Haven","New Hope","New Iberia","New Kensington","New London","New Madrid","New Market","New Martinsville","New Milford","New Orleans","New Paltz","New Philadelphia","New Rochelle","New Smyrna Beach","New Ulm","New Windsor","New York City","Newark","Newberg","Newburgh","Newburyport","Newcastle","Newport","Newport Beach","Newport News","Newton","Niagara Falls","Niles","Nogales","Nome","Norfolk","Normal","Norman","Norris","Norristown","North Adams","North Chicago","North College Hill","North Haven","North Hempstead","North Kingstown","North Las Vegas","North Little Rock","North Platte","Northampton","Northfield","Norton","Norwalk","Norwich","Norwood","Novato","Nyack","Oak Harbor","Oak Park","Oak Ridge","Oakland","Oberlin","Ocala","Ocean City","Ocean Springs","Oceanside","Oconto","Odessa","Ogden","Ogdensburg","Oil City","Ojai","Oklahoma City","Okmulgee","Olathe","Old Saybrook","Olean","Olympia","Omaha","Oneida","Oneonta","Ontario","Opelika","Opelousas","Oraibi","Orange","Orangeburg","Orderville","Oregon","Oregon City","Orem","Orlando","Ormond Beach","Orono","Oroville","Osawatomie","Osceola","Oshkosh","Oskaloosa","Ossining","Oswego","Ottawa","Ottumwa","Ouray","Overland Park","Owatonna","Owensboro","Oxford","Oxnard","Oyster Bay","Ozark","Pacific Grove","Paducah","Pagosa Springs","Painesville","Palatine","Palatka","Palm Bay","Palm Beach","Palm Springs","Palmdale","Palmer","Palmyra","Palo Alto","Pampa","Panama City","Panguitch","Paris","Park City","Park Forest","Park Ridge","Parkersburg","Parma","Parsippany–Troy Hills","Pasadena","Pascagoula","Pasco","Pass Christian","Passaic","Paterson","Pauls Valley","Pawhuska","Pawtucket","Payson","Peabody","Pecos","Peekskill","Pekin","Pendleton","Pensacola","Peoria","Perry","Perth Amboy","Peru","Peshtigo","Petaluma","Peterborough","Petersburg","Petoskey","Pharr","Phenix City","Philadelphia","Philippi","Phoenix","Phoenixville","Pierre","Pine Bluff","Pinehurst","Pipestone","Piqua","Pittsburg","Pittsburgh","Pittsfield","Plainfield","Plains","Plainview","Plano","Plattsburgh","Plattsmouth","Plymouth","Pocatello","Point Pleasant","Point Roberts","Pomona","Pompano Beach","Ponca City","Pontiac","Port Angeles","Port Arthur","Port Gibson","Port Hueneme","Port Huron","Port Lavaca","Port Orford","Port Washington","Portage","Portales","Portland","Portsmouth","Potsdam","Pottstown","Pottsville","Poughkeepsie","Powell","Prairie du Chien","Prescott","Presque Isle","Price","Prichard","Priest River","Princeton","Prineville","Providence","Provincetown","Provo","Pryor","Pueblo","Pullman","Put-in-Bay","Puyallup","Queens","Quincy","Racine","Raleigh","Rancho Cucamonga","Randolph","Rantoul","Rapid City","Raton","Rawlins","Reading","Red Bluff","Red Cloud","Red Wing","Redding","Redlands","Redmond","Redondo Beach","Redwood City","Reedsport","Reno","Rensselaer","Renton","Reston","Revere","Rexburg","Rhinelander","Richardson","Richland","Richmond","Ridgewood","Ripon","River Forest","Riverside","Riverton","Roanoke","Rochester","Rock Hill","Rock Island","Rock Springs","Rockford","Rockland","Rockville","Rocky Mount","Rogers","Rolla","Rome","Romney","Roseburg","Roselle","Roseville","Roswell","Rotterdam","Royal Oak","Rugby","Rumford","Ruston","Rutherford","Rutland","Rye","Saco","Sacramento","Sag Harbor","Saginaw","Saint Albans","Saint Augustine","Saint Charles","Saint Cloud","Saint George","Saint Ignace","Saint Johnsbury","Saint Joseph","Saint Louis","Saint Martinville","Saint Marys City","Saint Paul","Saint Petersburg","Sainte Genevieve","Salem","Salina","Salinas","Salisbury","Sallisaw","Salt Lake City","San Angelo","San Antonio","San Bernardino","San Clemente","San Diego","San Felipe","San Fernando","San Francisco","San Gabriel","San Jose","San Juan Capistrano","San Leandro","San Luis Obispo","San Marcos","San Marino","San Mateo","San Pedro","San Rafael","San Simeon","Sand Springs","Sandusky","Sandwich","Sanford","Santa Ana","Santa Barbara","Santa Clara","Santa Clarita","Santa Claus","Santa Cruz","Santa Fe","Santa Monica","Santa Rosa","Sapulpa","Saranac Lake","Sarasota","Saratoga Springs","Saugus","Sauk Centre","Sault Sainte Marie","Sausalito","Savannah","Scarborough","Scarsdale","Schenectady","Scottsboro","Scottsdale","Scranton","Searcy","Seaside","Seattle","Sebring","Sedalia","Selma","Seminole","Seneca Falls","Seward","Seymour","Shaker Heights","Shamokin","Sharon","Shawnee","Shawneetown","Sheboygan","Sheffield","Shelby","Shelbyville","Shelton","Shepherdstown","Sheridan","Sherman","Shiprock","Shreveport","Sidney","Sierra Vista","Silver City","Silver Spring","Silverton","Simi Valley","Simsbury","Sioux City","Sioux Falls","Sitka","Skagway","Skokie","Smith Center","Smyrna","Socorro","Somersworth","Somerville","Sonoma","South Bend","South Charleston","South Hadley","South Holland","South Kingstown","South Orange Village","South Saint Paul","South San Francisco","Southampton","Southington","Spanish Fork","Sparks","Spartanburg","Spearfish","Spokane","Spring Green","Springfield","Springville","Stamford","Starkville","State College","Staten Island","Staunton","Steamboat Springs","Sterling","Steubenville","Stevens Point","Stillwater","Stockbridge","Stockton","Stonington","Stony Brook","Stony Point","Stoughton","Stratford","Streator","Stroudsburg","Sturbridge","Sturgeon Bay","Sturgis","Stuttgart","Sudbury","Suffolk","Summersville","Summit","Sumter","Sun Valley","Sunbury","Sunnyvale","Superior","Susanville","Swarthmore","Sweetwater","Sylacauga","Syracuse","Tacoma","Tahlequah","Takoma Park","Talladega","Tallahassee","Tamaqua","Tampa","Taos","Tarpon Springs","Tarrytown","Taunton","Telluride","Tempe","Temple","Ten Sleep","Terre Haute","Tewksbury","Texarkana","Texas City","The Dalles","The Village","Thermopolis","Thibodaux","Thousand Oaks","Ticonderoga","Tiffin","Tillamook","Titusville","Tiverton","Toccoa","Toledo","Tombstone","Tonawanda","Tooele","Topeka","Torrance","Torrington","Totowa","Towson","Traverse City","Trenton","Trinidad","Troy","Truro","Truth or Consequences","Tucson","Tucumcari","Tullahoma","Tulsa","Tupelo","Turlock","Tuscaloosa","Tuscumbia","Tuskegee","Twin Falls","Tyler","Ukiah","Union","Union City","Uniontown","Urbana","Utica","Uvalde","Vail","Valdez","Valdosta","Vallejo","Valley City","Valparaiso","Van Buren","Vancouver","Vandalia","Venice","Ventura","Vermillion","Vernal","Vicksburg","Victoria","Victorville","Vincennes","Vineland","Vinita","Virden","Virginia","Virginia Beach","Virginia City","Visalia","Wabash","Waco","Wahiawa","Wahpeton","Wailuku","Waimea","Walla Walla","Wallingford","Walnut Creek","Walpi","Walsenburg","Warm Springs","Warner Robins","Warren","Warrensburg","Warwick","Washington","Waterbury","Waterford","Waterloo","Watertown","Waterville","Watervliet","Watkins Glen","Watts","Waukegan","Waukesha","Wausau","Wauwatosa","Waycross","Wayne","Waynesboro","Weatherford","Webster","Webster City","Weehawken","Weirton","Welch","Wellesley","Wellfleet","Wellsburg","Wenatchee","West Allis","West Bend","West Bridgewater","West Chester","West Covina","West Des Moines","West Hartford","West Haven","West Lafayette","West Memphis","West New York","West Orange","West Palm Beach","West Plains","West Point","West Seneca","West Springfield","Westerly","Westfield","Westminster","Weston","Westport","Wethersfield","Wewoka","Weymouth","Wheaton","Wheeling","White Plains","White Springs","White Sulphur Springs","Whitman","Whittier","Wichita","Wichita Falls","Wickford","Wilkes-Barre","Williamsburg","Williamson","Williamsport","Williamstown","Willimantic","Willingboro","Williston","Willmar","Wilmette","Wilmington","Wilson","Winchester","Windham","Window Rock","Windsor","Windsor Locks","Winnemucca","Winnetka","Winona","Winooski","Winslow","Winsted","Winston-Salem","Winter Haven","Winter Park","Wisconsin Dells","Woburn","Wood River","Woodbridge","Woodland","Woods Hole","Woodstock","Woodward","Woonsocket","Wooster","Worcester","Worland","Worthington","Wyandotte","Xenia","Yakima","Yankton","Yazoo City","Yellow Springs","Yonkers","Yorba Linda","York","Youngstown","Ypsilanti","Ysleta","Yuba City","Yuma","Zanesville","Zion"];


const useStyles = makeStyles(({
    topMarg: {
        marginTop: 100,
    },
    gridMarg: {
        marginTop: 25,
    },
}));

function UserSettings(props) {
    const history = useHistory(); //Variable for navigation. 
    const classes = useStyles(); //Variable for custom styles
    const [newUsername, setNewUsername] = useState(''); //Variable and setter for updated username
    const [newPassword, setNewPassword] = useState(''); //Variable and setter for a new password
    const [newEmail, setNewEmail] = useState(''); //Variable and setter for a new emabil address. 
    const usernameRef = useRef(null);
    const [makingEdit, setMakingEdit] = useState(false); //Variable and setter to disable buttons when change is being made
    const [town, setTown] = useState(myCities[0]); //Variable and setter for selected city.
    const regularExpressions = {
        usernameExpression: /^\w+$/,
        alphaStartRe: /^[A-Za-z]+$/,
        emailRe: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    }; //These are the regular expressions that must be matched!

    useEffect(() => {
        //First we need to see if the user is logged in. If not, we re-route them home. 
        if(props.user === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to manage your settings!',
                'error',
            );

            history.push('/');
        }
        else {
            return axios({
                method: 'GET',
                url: `http://192.168.0.17:3001/api/grab/user/${props.user.uniqueUserId}`,
            }).then(response => {
                //After the call, update the user and the theme color. 
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error trying to update your settings!',
                    'error',
                );

                history.goBack(1);
            });
        }
    }, []);

    function preventSpaces(e) {
        //This function will prevent a user from adding spaces to their username 
        if(e.keyCode === 32) {
            e.preventDefault();
            return false;
        }
    }

    function changeUsername() {
        //This function will handle updating a username 
        setMakingEdit(true);

        if(newUsername.length.trim < 6) {
            swal(
                'Uh Oh!',
                'Username must be at least 6 characters long!',
                'error',
            ); 
            setMakingEdit(false);
            return false;
        }
        else if(newUsername.length > 24) {
            swal(
                'Uh Oh!',
                'Username must not be more than 24 characters long!',
                'error',
            ); 
            setMakingEdit(false);
            return false;
        }
        else if(!regularExpressions.usernameExpression.test(newUsername)) {
            swal(
                'Uh Oh!',
                'Username can only contain letters, numbers, and underscores, and it must start with a letter!',
                'error',
            ); 
            setMakingEdit(false);
            return false;
        }
        else if(!regularExpressions.alphaStartRe.test(newUsername.slice(0, 1))) {
            swal(
                'Uh Oh!',
                'Username must start with a letter',
                'error',
            ); 
            setMakingEdit(false);
            return false;
        }
        else {
            let data = JSON.stringify({
                uniqueUserId: props.user.uniqueUserId,
                username: newUsername,
            });

            return axios({
                method: 'POST',
                url: 'http://192.168.0.17:3001/api/change/username',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if(response.data === 'username taken') {
                    swal(
                        'Uh Oh!',
                        'That username is taken. Please select another one!',
                        'error',
                    );
                    setMakingEdit(false);
                }
                else {
                    swal(
                        'Great!',
                        'You successfully changed your username!',
                        'success',
                    );
                    props.dispatch({type: 'user/updateUser', payload: response.data.user});
                    setNewUsername('');
                    setMakingEdit(false);
                }
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error trying to update your username!',
                    'error',
                );
                setMakingEdit(false);
            });
        }
    }

    function changePassword() {
        //This function will handle changing the user password. 
        setMakingEdit(true);
        if(newPassword.trim().length < 6) {
            swal(
                'Uh Oh!',
                'Your password must be at least 6-characters long!',
                'error',
            );
            setMakingEdit(false);
            return false;
        }
        else {
            let data = JSON.stringify({
                uniqueUserId: props.user.uniqueUserId,
                password: newPassword,
            });

            return axios({
                method: 'POST',
                url: 'http://192.168.0.17:3001/api/change/password',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                swal(
                    'Great!',
                    'You successfully changed your password',
                    'success',
                );
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                setNewPassword('');
                setMakingEdit(false);
            }).catch(err => {
                console.log(err.message);
                swal(
                    'Uh Oh!',
                    'There was an error updating your password!',
                    'error',
                );
                setMakingEdit(false);
            });
        }
    }

    function changeEmail(){
        //This function will handle changing a user email 
        setMakingEdit(true);

        if(!regularExpressions.emailRe.test(newEmail)) {
            swal(
                'Uh Oh!',
                'Email must be in valid email format!',
                'error',
            );
            setMakingEdit(false);
            return false;
        }
        else {
            let data = JSON.stringify({
                email: newEmail,
                uniqueUserId: props.user.uniqueUserId,
            });

            return axios({
                method: 'POST',
                url: 'http://192.168.0.17:3001/api/change/email',
                data: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                swal(
                    'Great!',
                    'Successfully updated your email address!',
                    'success',
                )
                props.dispatch({type: 'user/updateUser', payload: response.data.user});
                setNewEmail('');
                setMakingEdit(false);
            });
        }
    }

    function updateCity() {
        //This function will handle updating the users city!
        setMakingEdit(true);

        let data = JSON.stringify({
            uniqueUserId: props.user.uniqueUserId,
            city: town,
        });

        return axios({
            method: 'POST',
            url: 'http://192.168.0.17:3001/api/update/user/city',
            data: data,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => {
            swal(
                'Great!',
                'You have successfully updated your city!',
                'success',
            );
            props.dispatch({type: 'user/updateUser', payload: response.data.user});
            setTown(myCities[0]);
            setMakingEdit(false);
        }).catch(err => {
            console.log(err.message);
            swal(
                'Uh Oh!',
                'There was an error updating your city! Please try again!',
                'error',
            );
            setMakingEdit(false);
        });
    }

    if(props.user) {
        return (
            <Grid 
                container 
                className={classes.topMarg}
            >
                <Grid 
                    item 
                    xs={12} 
                >
                    <Typography
                        variant='h6' 
                        component='h6' 
                        align='center' 
                    >
                        Settings 
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                >
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center' 
                        color={(newUsername.length < 6 || newUsername.length > 24) ? 'error' : 'default'}
                    >
                        {newUsername.length}/24
                    </Typography>
                    <TextField 
                        value={newUsername}
                        onChange={e => setNewUsername(e.target.value)}
                        label='Update username'
                        placeholder={props.user.username}
                        helperText={(newUsername.length > 24 || newUsername.length < 6) ? 'Username must be between 6 and 24 characters long!' : 'Username must start with a letter and can only contain letters numbers and underscores with no spaces'}
                        onKeyDown={preventSpaces}
                        color='primary' 
                        variant='outlined'
                        aria-label='Username' 
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                    />
                    <Button 
                        style={{
                            marginTop: 20,
                            margin: 'auto',
                        }}
                        color='primary' 
                        variant='contained' 
                        onClick={changeUsername}
                        disabled={makingEdit}
                    >
                        {makingEdit ? <CircularProgress /> : 'change username'}
                    </Button>
                </Grid>
                <Grid 
                    xs={12} 
                    item 
                >
                    <div 
                        style={{
                            marginTop: 30,
                        }}
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center'
                        >
                            Password 
                        </Typography>
                        <TextField 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)}
                            variant='outlined' 
                            placeholer='Password' 
                            type='password' 
                            label='password'
                            helperText='Password must be at least 6-characters long!' 
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth 
                        />
                        <Button 
                            style={{
                                marginTop: 20,
                            }}
                            variant='contained' 
                            color='primary' 
                            disabled={makingEdit} 
                            onClick={changePassword}
                        >
                            {makingEdit ? <CircularProgress /> : 'Update password'} 
                        </Button>
                    </div>
                </Grid>
                <Grid 
                    item
                    xs={12}
                >
                    <div 
                        style={{
                            marginTop: 25,
                        }}
                    >
                        <Typography 
                            variant='h6' 
                            component='h6' 
                            align='center'
                        >
                            Email
                        </Typography>
                        <TextField 
                            onKeyDown={preventSpaces}
                            value={newEmail} 
                            onChange={e => setNewEmail(e.target.value)}
                            placeholer={props.user.email} 
                            label='Email' 
                            variant='outlined' 
                            InputLabelProps = {{
                                shrink: true,
                            }}
                            fullWidth 
                        />
                        <Button 
                            variant='contained' 
                            color='primary' 
                            disabled={makingEdit} 
                            onClick={changeEmail} 
                            style={{
                                marginTop: 25,
                            }}
                        >
                            {makingEdit ? <CircularProgress /> : 'Change email'}
                        </Button>
                    </div>
                </Grid>
                <Divider />
                {/* Now begin the Grid for the city section */}
                <Grid 
                    item 
                    xs={12} 
                >
                    <Autocomplete 
                        style={{
                            marginTop: 25,
                        }} 
                        value={town}
                        onChange={(e, newVal) => setTown(newVal)}
                        options={myCities}
                        getOptionLabel={option => option}
                        renderOption={option => (
                            <Typography 
                                variant='body1' 
                                component='p'
                            >
                                {option}
                            </Typography>
                        )}
                        renderInput={params => (
                            <TextField 
                                {...params} 
                                color='primary' 
                                variant='outlined'
                                label='City' 
                                placeholder='City' 
                                helperText='If your city is not in the list, select the nearest city!'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                required 
                            />
                        )}
                    />
                    <Button 
                        style={{
                            marginTop: 20,
                        }}
                        color='primary' 
                        variant='contained' 
                        disabled={makingEdit} 
                        onClick={updateCity}
                    >
                        {makingEdit ? <CircularProgress /> : 'Update city'}
                    </Button>
                </Grid>
            </Grid>
        );
    }
    else {
        return (
            <Backdrop 
                open={true} 
            >
                <CircularProgress 
                    color='primary' 
                />
            </Backdrop>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        theme: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(UserSettings);