import React, { useState, useRef, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import CameraIcon from '@material-ui/icons/CameraAlt';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as _ from 'underscore';
import swal from 'sweetalert';

const useStyles = makeStyles(() => ({
    gridTopMarg: {
        marginTop: 100,
    },
    input: {
        display: 'none',
    },
}));

const myCities = ["Abbeville","Aberdeen","Abilene","Abingdon","Abington","Acoma","Ada","Adams","Adrian","Aiken","Ajo","Akron","Alameda","Alamogordo","Alamosa","Albany","Albert Lea","Albuquerque","Alcoa","Alexander City","Alexandria","Alhambra","Aliquippa","Allentown","Alliance","Alma","Alpine","Alta","Alton","Altoona","Altus","Alva","Amana Colonies","Amarillo","Ambridge","American Fork","Americus","Ames","Amesbury","Amherst","Amsterdam","Anaconda","Anacortes","Anadarko","Anaheim","Anchorage","Andalusia","Anderson","Andersonville","Andover","Ann Arbor","Annapolis","Anniston","Ansonia","Antioch","Apalachicola","Appleton","Arcadia","Ardmore","Arkadelphia","Arkansas City","Arkansas Post","Arlington","Arlington Heights","Artesia","Arthur","Asbury Park","Asheboro","Asheville","Ashland","Ashtabula","Aspen","Astoria","Atchison","Athens","Athol","Atlanta","Atlantic City","Atmore","Attleboro","Auburn","Augusta","Aurora","Austin","Avondale","Babylon","Bainbridge","Baker City","Bakersfield","Baltimore","Bangor","Bar Harbor","Baraboo","Barberton","Barbourville","Bardstown","Barnstable","Barre","Barrington","Barstow","Bartlesville","Bartow","Bastrop","Batavia","Batesville","Bath","Baton Rouge","Battle Creek","Bay City","Bay Saint Louis","Bayonne","Baytown","Beacon","Beatrice","Beaufort","Beaumont","Beaverton","Beckley","Bedford","Belen","Belfast","Belle Fourche","Belle Glade","Bellefontaine","Belleville","Bellevue","Bellingham","Bellows Falls","Belmont","Beloit","Belvidere","Bemidji","Bend","Bennington","Benton","Benton Harbor","Berea","Berkeley","Berlin","Bessemer","Bethany","Bethesda-Chevy Chase","Bethlehem","Beverly","Beverly Hills","Biddeford","Big Spring","Billings","Biloxi","Binghamton","Birmingham","Bisbee","Bismarck","Blackfoot","Blairsville","Bloomfield","Bloomfield Hills","Bloomington","Bloomsburg","Bluefield","Blytheville","Boca Raton","Bogalusa","Boise","Bonners Ferry","Boone","Boonesborough","Boonville","Boothbay Harbor","Bordentown","Borger","Bossier City","Boston","Boulder","Boulder City","Bound Brook","Bountiful","Bourne","Bowie","Bowling Green","Boys Town","Bozeman","Bradenton","Bradford","Brainerd","Braintree","Branford","Branson","Brattleboro","Brea","Breckenridge","Bremerton","Bridgeport","Bridgeton","Brigham City","Brighton","Bristol","Brockton","Bronx","Brookfield","Brookings","Brookline","Brooklyn","Brownsville","Brunswick","Bryan","Buckhannon","Buena Park","Buffalo","Burbank","Burlington","Burns","Butte","Cadillac","Cahokia","Cairo","Calais","Caldwell","Calexico","Calhoun","Calistoga","Calumet City","Cambridge","Camden","Campbellsville","Canon City","Canton","Canyon","Cape Coral","Cape Girardeau","Cape May","Carbondale","Caribou","Carlinville","Carlisle","Carlsbad","Carmel","Carrollton","Carson City","Carthage","Casa Grande","Casper","Castine","Catonsville","Cedar City","Cedar Falls","Cedar Rapids","Central City","Central Falls","Centralia","Chadron","Chambersburg","Champaign","Chandler","Chanute","Chapel Hill","Charles City","Charles Town","Charleston","Charlestown","Charlevoix","Charlotte","Charlottesville","Chattanooga","Chautauqua","Cheboygan","Cheektowaga","Chelmsford","Chelsea","Cherokee","Chesapeake","Chester","Cheyenne","Chicago","Chicago Heights","Chickasaw","Chickasha","Chico","Chicopee","Chillicothe","Chula Vista","Cicero","Cincinnati","Clanton","Claremont","Claremore","Clarksburg","Clarksdale","Clarksville","Clayton","Clearfield","Clearwater","Cleburne","Cleveland","Cleveland Heights","Clifton","Climax","Clinton","Clovis","Cocoa Beach","Cocoa-Rockledge","Cody","Coeur d’Alene","Coffeyville","Cohasset","Cohoes","College Park","College Station","Collinsville","Colorado Springs","Columbia","Columbus","Compton","Concord","Coney Island","Conneaut","Connersville","Conway","Cookeville","Cooperstown","Coos Bay","Coral Gables","Cordova","Corinth","Corning","Corona","Coronado","Corpus Christi","Cortez","Cortland","Corvallis","Corydon","Costa Mesa","Coulee Dam","Council Bluffs","Council Grove","Coupeville","Coventry","Covington","Cranford","Cranston","Crawfordsville","Cripple Creek","Crookston","Crossett","Crown Point","Crystal City","Cullman","Culver City","Cumberland","Cushing","Custer","Cuyahoga Falls","Dahlonega","Dallas","Dalton","Daly City","Danbury","Danvers","Danville","Darien","Darlington","Dartmouth","Davenport","Davis","Dayton","Daytona Beach","De Land","De Smet","DeKalb","Deadwood","Dearborn","Decatur","Dedham","Deerfield Beach","Defiance","Del Rio","Delaware","Delray Beach","Delta","Deming","Demopolis","Denison","Dennis","Denton","Denver","Derby","Derry","Des Moines","Des Plaines","Detroit","Devils Lake","Dickinson","Dillon","Dixon","Dodge City","Dothan","Douglas","Dover","Downey","Dubuque","Duluth","Duncan","Dunkirk","Durango","Durant","Durham","Duxbury","Eagle Pass","East Aurora","East Chicago","East Cleveland","East Greenwich","East Hampton","East Hartford","East Haven","East Lansing","East Liverpool","East Moline","East Orange","East Point","East Providence","East Saint Louis","Eastchester","Eastham","Easton","Eastpointe","Eastport","Eau Claire","Ecorse","Edenton","Edgartown","Edinburg","Edison","Edmond","Effingham","El Centro","El Cerrito","El Dorado","El Monte","El Paso","El Reno","Elgin","Elizabeth","Elizabeth City","Elizabethton","Elizabethtown","Elk City","Elkhart","Elkins","Elko","Elkton","Ellensburg","Ellsworth","Elmhurst","Elmira","Elwood","Ely","Elyria","Emmitsburg","Emporia","Enfield","Englewood","Enid","Enterprise","Ephrata","Erie","Escanaba","Escondido","Essex","Estes Park","Estherville","Euclid","Eufaula","Eugene","Eureka","Evanston","Evansville","Eveleth","Everett","Excelsior Springs","Exeter","Fairbanks","Fairfax","Fairfield","Fairhaven","Fairmont","Fall River","Fallon","Falls Church","Falmouth","Fargo","Faribault","Farmington","Fayetteville","Fergus Falls","Ferguson","Fernandina Beach","Fillmore","Findlay","Fitchburg","Fitzgerald","Flagstaff","Flint","Florence","Florissant","Flushing","Fond du Lac","Fontana","Forest Hills","Forrest City","Fort Benton","Fort Collins","Fort Dodge","Fort Kent","Fort Lauderdale","Fort Lee","Fort Morgan","Fort Myers","Fort Payne","Fort Pierce","Fort Scott","Fort Smith","Fort Valley","Fort Walton Beach","Fort Wayne","Fort Worth","Framingham","Frankfort","Franklin","Frederick","Fredericksburg","Fredonia","Freeport","Fremont","French Lick","Fresno","Fullerton","Fulton","Gadsden","Gaffney","Gainesville","Galena","Galesburg","Gallatin","Gallipolis","Gallup","Galveston","Garden City","Garden Grove","Gardiner","Garland","Gary","Gastonia","Gatlinburg","Geneva","Genoa","Georgetown","Germantown","Gettysburg","Gila Bend","Gillette","Glassboro","Glen Ellyn","Glendale","Glendive","Glens Falls","Glenview","Glenwood Springs","Globe","Gloucester","Gloversville","Golden","Goldfield","Goldsboro","Goliad","Goshen","Grafton","Grand Forks","Grand Haven","Grand Island","Grand Junction","Grand Rapids","Granite City","Grants","Grants Pass","Grayling","Great Barrington","Great Bend","Great Falls","Great Neck","Greeley","Green Bay","Green River","Greenbelt","Greeneville","Greenfield","Greensboro","Greensburg","Greenville","Greenwich","Greenwood","Grenada","Gretna","Grinnell","Grosse Pointe","Groton","Guilford","Gulfport","Gunnison","Guntersville","Guthrie","Guymon","Hackensack","Haddonfield","Hagerstown","Haines","Halifax","Hallandale Beach","Hamden","Hamilton","Hammond","Hammondsport","Hampton","Hanalei","Hancock","Hannibal","Hanover","Harlan","Harlem","Harlingen","Harmony","Harpers Ferry","Harrisburg","Harrison","Harrodsburg","Hartford","Hartsville","Harwich","Hastings","Hattiesburg","Haverhill","Havre","Hays","Hayward","Hazard","Hazleton","Heber City","Helena","Hempstead","Henderson","Herkimer","Herrin","Hershey","Hialeah","Hibbing","Hickory","High Point","Highland Park","Hillsboro","Hillsborough","Hilo","Hingham","Hinton","Hobart","Hobbs","Hoboken","Hodgenville","Holdenville","Holland","Holly Springs","Hollywood","Holyoke","Homer","Homestead","Honaunau","Honesdale","Honolulu","Hood River","Hope","Hopewell","Hopkinsville","Hoquiam","Hot Springs","Houghton","Houlton","Houma","Houston","Hudson","Hugo","Huntington","Huntington Beach","Huntsville","Huron","Hutchinson","Hyannis","Hyattsville","Hyde Park","Idaho City","Idaho Falls","Ilion","Independence","Indiana","Indianapolis","Indianola","Indio","Inglewood","Interlochen","International Falls","Iowa City","Ipswich","Iron Mountain","Ironwood","Irvine","Irving","Irvington","Ishpeming","Ithaca","Jackson","Jacksonville","Jamestown","Janesville","Jasper","Jeannette","Jefferson City","Jeffersonville","Jersey City","Jim Thorpe","John Day","Johnson City","Johnstown","Joliet","Jonesboro","Jonesborough","Joplin","Junction City","Juneau","Kahului","Kalamazoo","Kalispell","Kanab","Kaneohe","Kankakee","Kansas City","Kapaa","Kaskaskia","Kawaihae","Kearney","Keene","Kellogg","Kelso","Kennebunkport","Kennewick","Kenosha","Kent","Keokuk","Ketchikan","Kettering","Kewanee","Key West","Keyser","Kilgore","Killeen","Kingman","Kingsport","Kingston","Kingsville","Kinston","Kirksville","Kittery","Kitty Hawk","Klamath Falls","Knoxville","Kodiak","Kokomo","Kotzebue","La Crosse","La Grande","La Grange","La Habra","La Junta","La Salle","Lackawanna","Laconia","Lafayette","Laguna Beach","Lahaina","Laie","Lake Charles","Lake City","Lake Forest","Lake Geneva","Lake Havasu City","Lake Oswego","Lake Placid","Lake Wales","Lakehurst","Lakeland","Lakeview","Lakewood","Lamar","Lancaster","Lander","Lansing","Laramie","Laredo","Largo","Las Cruces","Las Vegas","Laurel","Lawrence","Lawton","Layton","Lead","Leadville","Leavenworth","Lebanon","Lehi","Lenox","Leominster","Levittown","Lewes","Lewisburg","Lewiston","Lewistown","Lexington","Liberal","Libertyville","Lima","Lincoln","Lisle","Litchfield","Little Falls","Little Rock","Littleton","Livermore","Livingston","Livonia","Lock Haven","Lockport","Lodi","Logan","Lombard","Lompoc","Long Beach","Long Branch","Longmont","Longview","Lorain","Los Alamos","Los Angeles","Louisville","Loveland","Lovington","Lowell","Lower Southampton","Lubbock","Lubec","Ludington","Ludlow","Lufkin","Lumberton","Lynchburg","Lynn","Machias","Mackinaw City","Macomb","Macon","Madison","Magnolia","Malden","Malibu","Mamaroneck","Manassas","Manchester","Mandan","Manhattan","Manistee","Manitowoc","Mankato","Mansfield","Manti","Marblehead","Marietta","Marinette","Marion","Marlborough","Marquette","Marshall","Martinez","Martins Ferry","Martinsburg","Martinsville","Marysville","Maryville","Mason City","Massena","Massillon","Mattoon","Mayfield","Maysville","McAlester","McAllen","McCook","McKeesport","McKinney","McMinnville","McPherson","Meadville","Medford","Medicine Lodge","Melbourne","Memphis","Menasha","Menlo Park","Menominee","Mentor","Merced","Meriden","Meridian","Mesa","Mesquite","Mexico","Miami","Miami Beach","Michigan City","Middlebury","Middlesboro","Middletown","Midland","Midwest City","Milan","Milbank","Miles City","Milford","Millburn","Milledgeville","Millville","Milton","Milwaukee","Minden","Mineola","Minneapolis","Minot","Mishawaka","Mission","Missoula","Mitchell","Moab","Mobile","Mobridge","Modesto","Moline","Monett","Monmouth","Monroe","Monroeville","Montclair","Monterey","Montgomery","Monticello","Montpelier","Montrose","Moore","Moorhead","Morehead City","Morgan City","Morganton","Morgantown","Morrilton","Morristown","Moscow","Moses Lake","Moundsville","Mount Clemens","Mount Holly","Mount Pleasant","Mount Vernon","Mountain View","Muncie","Mundelein","Murfreesboro","Murray","Muscatine","Muskegon","Muskogee","Myrtle Beach","Mystic","Nacogdoches","Nags Head","Nahant","Nampa","Nanticoke","Naperville","Naples","Nappanee","Narragansett","Nashua","Nashville","Natchez","Natchitoches","Natick","Naugatuck","Nauvoo","Nebraska City","Needles","Neenah","Neosho","Nephi","New Albany","New Bedford","New Bern","New Braunfels","New Britain","New Brunswick","New Castle","New Glarus","New Harmony","New Haven","New Hope","New Iberia","New Kensington","New London","New Madrid","New Market","New Martinsville","New Milford","New Orleans","New Paltz","New Philadelphia","New Rochelle","New Smyrna Beach","New Ulm","New Windsor","New York City","Newark","Newberg","Newburgh","Newburyport","Newcastle","Newport","Newport Beach","Newport News","Newton","Niagara Falls","Niles","Nogales","Nome","Norfolk","Normal","Norman","Norris","Norristown","North Adams","North Chicago","North College Hill","North Haven","North Hempstead","North Kingstown","North Las Vegas","North Little Rock","North Platte","Northampton","Northfield","Norton","Norwalk","Norwich","Norwood","Novato","Nyack","Oak Harbor","Oak Park","Oak Ridge","Oakland","Oberlin","Ocala","Ocean City","Ocean Springs","Oceanside","Oconto","Odessa","Ogden","Ogdensburg","Oil City","Ojai","Oklahoma City","Okmulgee","Olathe","Old Saybrook","Olean","Olympia","Omaha","Oneida","Oneonta","Ontario","Opelika","Opelousas","Oraibi","Orange","Orangeburg","Orderville","Oregon","Oregon City","Orem","Orlando","Ormond Beach","Orono","Oroville","Osawatomie","Osceola","Oshkosh","Oskaloosa","Ossining","Oswego","Ottawa","Ottumwa","Ouray","Overland Park","Owatonna","Owensboro","Oxford","Oxnard","Oyster Bay","Ozark","Pacific Grove","Paducah","Pagosa Springs","Painesville","Palatine","Palatka","Palm Bay","Palm Beach","Palm Springs","Palmdale","Palmer","Palmyra","Palo Alto","Pampa","Panama City","Panguitch","Paris","Park City","Park Forest","Park Ridge","Parkersburg","Parma","Parsippany–Troy Hills","Pasadena","Pascagoula","Pasco","Pass Christian","Passaic","Paterson","Pauls Valley","Pawhuska","Pawtucket","Payson","Peabody","Pecos","Peekskill","Pekin","Pendleton","Pensacola","Peoria","Perry","Perth Amboy","Peru","Peshtigo","Petaluma","Peterborough","Petersburg","Petoskey","Pharr","Phenix City","Philadelphia","Philippi","Phoenix","Phoenixville","Pierre","Pine Bluff","Pinehurst","Pipestone","Piqua","Pittsburg","Pittsburgh","Pittsfield","Plainfield","Plains","Plainview","Plano","Plattsburgh","Plattsmouth","Plymouth","Pocatello","Point Pleasant","Point Roberts","Pomona","Pompano Beach","Ponca City","Pontiac","Port Angeles","Port Arthur","Port Gibson","Port Hueneme","Port Huron","Port Lavaca","Port Orford","Port Washington","Portage","Portales","Portland","Portsmouth","Potsdam","Pottstown","Pottsville","Poughkeepsie","Powell","Prairie du Chien","Prescott","Presque Isle","Price","Prichard","Priest River","Princeton","Prineville","Providence","Provincetown","Provo","Pryor","Pueblo","Pullman","Put-in-Bay","Puyallup","Queens","Quincy","Racine","Raleigh","Rancho Cucamonga","Randolph","Rantoul","Rapid City","Raton","Rawlins","Reading","Red Bluff","Red Cloud","Red Wing","Redding","Redlands","Redmond","Redondo Beach","Redwood City","Reedsport","Reno","Rensselaer","Renton","Reston","Revere","Rexburg","Rhinelander","Richardson","Richland","Richmond","Ridgewood","Ripon","River Forest","Riverside","Riverton","Roanoke","Rochester","Rock Hill","Rock Island","Rock Springs","Rockford","Rockland","Rockville","Rocky Mount","Rogers","Rolla","Rome","Romney","Roseburg","Roselle","Roseville","Roswell","Rotterdam","Royal Oak","Rugby","Rumford","Ruston","Rutherford","Rutland","Rye","Saco","Sacramento","Sag Harbor","Saginaw","Saint Albans","Saint Augustine","Saint Charles","Saint Cloud","Saint George","Saint Ignace","Saint Johnsbury","Saint Joseph","Saint Louis","Saint Martinville","Saint Marys City","Saint Paul","Saint Petersburg","Sainte Genevieve","Salem","Salina","Salinas","Salisbury","Sallisaw","Salt Lake City","San Angelo","San Antonio","San Bernardino","San Clemente","San Diego","San Felipe","San Fernando","San Francisco","San Gabriel","San Jose","San Juan Capistrano","San Leandro","San Luis Obispo","San Marcos","San Marino","San Mateo","San Pedro","San Rafael","San Simeon","Sand Springs","Sandusky","Sandwich","Sanford","Santa Ana","Santa Barbara","Santa Clara","Santa Clarita","Santa Claus","Santa Cruz","Santa Fe","Santa Monica","Santa Rosa","Sapulpa","Saranac Lake","Sarasota","Saratoga Springs","Saugus","Sauk Centre","Sault Sainte Marie","Sausalito","Savannah","Scarborough","Scarsdale","Schenectady","Scottsboro","Scottsdale","Scranton","Searcy","Seaside","Seattle","Sebring","Sedalia","Selma","Seminole","Seneca Falls","Seward","Seymour","Shaker Heights","Shamokin","Sharon","Shawnee","Shawneetown","Sheboygan","Sheffield","Shelby","Shelbyville","Shelton","Shepherdstown","Sheridan","Sherman","Shiprock","Shreveport","Sidney","Sierra Vista","Silver City","Silver Spring","Silverton","Simi Valley","Simsbury","Sioux City","Sioux Falls","Sitka","Skagway","Skokie","Smith Center","Smyrna","Socorro","Somersworth","Somerville","Sonoma","South Bend","South Charleston","South Hadley","South Holland","South Kingstown","South Orange Village","South Saint Paul","South San Francisco","Southampton","Southington","Spanish Fork","Sparks","Spartanburg","Spearfish","Spokane","Spring Green","Springfield","Springville","Stamford","Starkville","State College","Staten Island","Staunton","Steamboat Springs","Sterling","Steubenville","Stevens Point","Stillwater","Stockbridge","Stockton","Stonington","Stony Brook","Stony Point","Stoughton","Stratford","Streator","Stroudsburg","Sturbridge","Sturgeon Bay","Sturgis","Stuttgart","Sudbury","Suffolk","Summersville","Summit","Sumter","Sun Valley","Sunbury","Sunnyvale","Superior","Susanville","Swarthmore","Sweetwater","Sylacauga","Syracuse","Tacoma","Tahlequah","Takoma Park","Talladega","Tallahassee","Tamaqua","Tampa","Taos","Tarpon Springs","Tarrytown","Taunton","Telluride","Tempe","Temple","Ten Sleep","Terre Haute","Tewksbury","Texarkana","Texas City","The Dalles","The Village","Thermopolis","Thibodaux","Thousand Oaks","Ticonderoga","Tiffin","Tillamook","Titusville","Tiverton","Toccoa","Toledo","Tombstone","Tonawanda","Tooele","Topeka","Torrance","Torrington","Totowa","Towson","Traverse City","Trenton","Trinidad","Troy","Truro","Truth or Consequences","Tucson","Tucumcari","Tullahoma","Tulsa","Tupelo","Turlock","Tuscaloosa","Tuscumbia","Tuskegee","Twin Falls","Tyler","Ukiah","Union","Union City","Uniontown","Urbana","Utica","Uvalde","Vail","Valdez","Valdosta","Vallejo","Valley City","Valparaiso","Van Buren","Vancouver","Vandalia","Venice","Ventura","Vermillion","Vernal","Vicksburg","Victoria","Victorville","Vincennes","Vineland","Vinita","Virden","Virginia","Virginia Beach","Virginia City","Visalia","Wabash","Waco","Wahiawa","Wahpeton","Wailuku","Waimea","Walla Walla","Wallingford","Walnut Creek","Walpi","Walsenburg","Warm Springs","Warner Robins","Warren","Warrensburg","Warwick","Washington","Waterbury","Waterford","Waterloo","Watertown","Waterville","Watervliet","Watkins Glen","Watts","Waukegan","Waukesha","Wausau","Wauwatosa","Waycross","Wayne","Waynesboro","Weatherford","Webster","Webster City","Weehawken","Weirton","Welch","Wellesley","Wellfleet","Wellsburg","Wenatchee","West Allis","West Bend","West Bridgewater","West Chester","West Covina","West Des Moines","West Hartford","West Haven","West Lafayette","West Memphis","West New York","West Orange","West Palm Beach","West Plains","West Point","West Seneca","West Springfield","Westerly","Westfield","Westminster","Weston","Westport","Wethersfield","Wewoka","Weymouth","Wheaton","Wheeling","White Plains","White Springs","White Sulphur Springs","Whitman","Whittier","Wichita","Wichita Falls","Wickford","Wilkes-Barre","Williamsburg","Williamson","Williamsport","Williamstown","Willimantic","Willingboro","Williston","Willmar","Wilmette","Wilmington","Wilson","Winchester","Windham","Window Rock","Windsor","Windsor Locks","Winnemucca","Winnetka","Winona","Winooski","Winslow","Winsted","Winston-Salem","Winter Haven","Winter Park","Wisconsin Dells","Woburn","Wood River","Woodbridge","Woodland","Woods Hole","Woodstock","Woodward","Woonsocket","Wooster","Worcester","Worland","Worthington","Wyandotte","Xenia","Yakima","Yankton","Yazoo City","Yellow Springs","Yonkers","Yorba Linda","York","Youngstown","Ypsilanti","Ysleta","Yuba City","Yuma","Zanesville","Zion"];

const myStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const topicList = [
    'Accounting', 'Activism', 'Animals And Pets', 'Art', 'Astrology', 'Athletes', 'Aviation', 'Bars', 'Baseball', 'Beauty And Makeup', 'Biking', 'Black Lives Matter', 'Brands/Products', 'Business', 'Careers', 'Cars And Motor Vehicles', 
    'Celebrity', 'College Baseball', 'College Basketball', 'College Football', 'Computer Science', 'Crafts And DYI', 'Crossfit', 'Crypto', 'Culture Race And Ethnicity', 'Dancing', 'Day Trading', 'Documentaries','Economics',
    'Education', 'Electronics', 'Entertainment', 'Ethics And Philosophy', 'Family And Relationships', 'Fashion', 'Filming', 'Fitness And Nutrition', 'Food And Drink', 'Funny/Humor',
    'Gaming', 'Gender', 'General', 'GeoCities', 'Greek Life', 'Hair', 'Health', 'History', 'Hobbies', 'Hockey', 'Home And Garden', 'Investing', 'International Culture', 'Internet Culture', 'Intramural Sports', 'Latin Culture', 'Marijuna', 'Marketplace And Deals',
    'Mature Themes And Adult Content', 'Medical And Mental Health', 'Meditation', "Men's Health", 'Military', 'Movies', 'Music', 'NBA', 'NFL', 'NHL', 'Nursing', 'Only Fans',
    'Outdoors And Nature', 'Partying', 'People', 'Personal Connections', 'Photography', 'Podcasts And Streamers', 'Politics', 'Pop Culture', 'Programming', 'Public Policy', 'Reading Writing And Literature', 
    'Religion And Spirituality', 'Robinhood Trading', 'Rowing', 'Running', 'Science', 'Sexual Health And Orientation', 'Side Hustle', 'Sports', 'Soccer', 'Social Justice', 'Software Engineering', 'Streaming', 'Tabletop Games', 'Television', 'Television Personalities', 'Theatre', 'Track & Field', 'Volleyball',
    "Women's Health", 'World News', 'Working Out/Gym', 'Work/Labor',
];

function EventBuilder(props) {
    const classes = useStyles();
    const formRef = useRef(null); //Validator form reference.
    const history = useHistory();
    const [title, setTitle] = useState(''); //Varible and setter for the title of the event. 
    const [description, setDescription] = useState(''); //Variable and setter for event description.
    const [topics, setTopics] = useState([]); //Variable and setter for event topics. 
    const [dateString, setDateString] = useState(new Date().getTime());//Variable and setter for the date string for event.
    const [selectedDate, setSelectedDate] = useState(new Date());//Variable and setter for the selected date time.
    const [img, setImg] = useState(null); //Variable and setter for the required event image.
    const [city, setCity] = useState(myCities[0]); //Variable and setter for the city of the event.
    const [eventState, setEventState] = useState(myStates[0]); //Variable and setter for the state the event is occuring in.
    const [formSending, setFormSending] = useState(false); //Variable and setter to disable Button when form is sending.

    useEffect(() => {
        if(props.user === null) {
            swal(
                'Uh Oh!',
                'You must be logged in to create an event!',
                'error',
            );
            history.goBack(1);
        }
        else {
            //This will update the theme to match the users' theme. 
            props.dispatch({type: 'ThemeChange', payload: props.user.profileTheme});
        }

        ValidatorForm.addValidationRule('titleLength', v => {
            //Validation rule to make sure event title is not empty and less than 100 characters long.
            if(v.trim().length < 1 || v.length > 100) {
                return false;
            }
            else {
                return true;
            }
        });

        ValidatorForm.addValidationRule('descriptionLength', v => {
            //Validation rule that demands description be between 20-1000 characters long. 
            if(v.trim().length < 20 || v.length > 1000) {
                return false;
            }
            else {
                return true;
            }
        });

    }, []);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        let amOrpm = date.getHours() < 12 ? 'am' : 'pm'
        console.log(new Date(date).getHours() + ':' + new Date(date).getMinutes() + amOrpm);
      };

    function handleTopicsChange(e) {
        //This function will add topics that are relevant to this event. 
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

    function handleEventDateChange(e, newVal) {
        //Function that will handle birthday change and ensure the user is at least 13 years old 
        let currentTime = Date.now();
        let utcDateTime = new Date(newVal);
        if(currentTime > utcDateTime) {
            swal(
                'Uh Oh!',
                'You must select a date in the future for this event!',
                'error',
            );
        }
        else {
            setDateString(newVal);
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

    async function handleImgChange(e) {
        //This function will handle storing an avatar in the avatar state variable and resizing it. 
        let file = e.target.files[0];
        let resizedImg = await resizerFunction(file);
        setImg(resizedImg);
    }

    async function sendForm() {
        //This function will handle sending the data to the server. 
        setFormSending(true);
        let validForm = await formRef.current.isFormValid();
        if(!validForm) {
            swal(
                'Uh Oh!',
                'You did not fill out the form correctly! Please check it.',
                'error',
            );
            setFormSending(false);
            return false;
        }
        else if(!img) {
            swal(
                'Uh Oh!',
                'You must add an image for your event!',
                'error',
            );
            setFormSending(false);
            return false;
        }

        else if(topics.length < 1) {
            swal(
                'Uh Oh!',
                'You must select at least one topic the event is related to!',
                'error',
            );
            setFormSending(false);
            return false;
        }
        else {
            //Create the proper date format data. 
            let hourConvertor = {
                13: 1,
                14: 2,
                15: 3,
                16: 4,
                17: 5, 
                18: 6,
                19: 7,
                20: 8,
                21: 9,
                22: 10,
                23: 11,
            }
            let hours = new Date (selectedDate).getHours(); //get the hours. 
            //Find out if it is AM or PM based on midnight or noon. 
            let amOrpm = hours < 12 ? 'am' : 'pm';
            //if hours are 0, change to 12 for midnight. 
            if(hours === 0) {
                hours = 12;
            }
            if(hours > 12) {
                hours = hourConvertor[hours];
            }
            let minutes = new Date(selectedDate).getMinutes();
            //if minutes are less than 10l add a 0. 
            if(minutes < 10) {
                minutes = '0' + minutes;
            }
            let timeString = hours + ':' + minutes + '' + amOrpm;
            let fd = new FormData();
            let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            let myDate = new Date(dateString);
            let month = months[myDate.getMonth()];
            let year = myDate.getFullYear();
            let day = myDate.getDate();
            let updatedString = `${month} ${day}, ${year}`;
            fd.append('title', title);
            fd.append('description', description);
            fd.append('timeString', timeString);
            fd.append('dateString', updatedString);
            fd.append('utcTime', new Date(dateString).getTime());
            fd.append('topics', topics);
            fd.append('city', city);
            fd.append('eventState', eventState);
            fd.append('img', img, 'img.jpg');
            fd.append('username', props.user.username);
            fd.append('uniqueUserId', props.user.uniqueUserId);
            fd.append('uniqueEventId', 'event' + props.user.uniqueUserId + Date.now() + props.user.username);

            return axios({
                method: 'POST',
                url: 'https://www.geocities.cc/api/create/event',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data === 'success') {
                    swal(
                        'Great!',
                        'You have successfully created that event!',
                        'success',
                    );
                    setTitle('');
                    setDescription('');
                    setTopics([...[]]);
                    setDateString(new Date().getTime());
                    setSelectedDate(new Date());
                    setImg(null);
                    setEventState(myStates[0]);
                    setCity(myCities[0]);
                    setFormSending(false);
                }
                else {
                    swal(
                        'Uh Oh!',
                        'There was an error creating that event!',
                        'error',
                    );
                    setFormSending(false);
                }
            }).catch(err => {
                console.log(err.message)
                swal(
                    'Uh Oh!',
                    'There was an error creating this event!',
                    'error',
                )
                setFormSending(false);
            });
        }
    }

    if(props.user) {
        return (
            <Grid 
                container 
                className={classes.gridTopMarg} 
            >
                <Grid 
                    item
                    xs={12} 
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center' 
                    >
                        Create an event! 
                    </Typography>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                >
                    <ValidatorForm 
                        onSubmit={e => console.log('submitted')}
                        ref={formRef} 
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
                                color={(title.length < 1 || title.length > 100) ? 'error' : 'default'}
                            >
                                {title.length}/100
                            </Typography>
                            <TextValidator 
                                label='Title' 
                                placeholder='Event Title' 
                                HelperText='Enter a title for the event between 1 and 100 characters long!'
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                color='primary' 
                                variant='outlined' 
                                inputLabelProps={{
                                    shrink: true,
                                }}
                                validators={['titleLength']}
                                errorMessages={['Event title must be between 1 and 100 characters long!']}
                                fullWidth 
                                required 
                                type='text' 
                            />
                        </div>
                        <div 
                            style={{
                                marginTop: 30,
                            }}
                        >
                            <Typography 
                                variant='h6' 
                                component='h6' 
                                align='center' 
                                color={(description.length < 20 || description.length > 1000) ? 'error' : 'default'}
                            >
                                {description.length}/1000
                            </Typography>
                            <TextValidator 
                                value={description} 
                                onChange={e => setDescription(e.target.value)} 
                                label='Event description' 
                                placeholder='Briefly describe this event...' 
                                helperText='Event description must be between 20 and 1000 characters long!' 
                                validators={['descriptionLength']} 
                                errorMessages={['Description must be between 20 and 1000 characters long!']} 
                                inputLabelProps={{
                                    shrink: true,
                                }}
                                color='primary' 
                                variant='outlined' 
                                type='text' 
                                rows={4} 
                                multiline
                                fullWidth
                                required 
                            />
                        </div>
                        <div 
                            style={{
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            <FormControl
                                component='fieldset' 
                                style={{
                                    margin: 'auto',
                                }}
                            >
                                <FormLabel 
                                    component='legend' 
                                >
                                    Select at least 1 topic for this event and up to 10!
                                </FormLabel>
                                <FormGroup 
                                    column 
                                >
                                    {topicList.map((topic, index) => (
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
                        </div>
                        <div 
                            style={{
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            <Typography 
                                variant='h6' 
                                component='h6'
                            >
                                Select a time and date for the event
                            </Typography>
                            <MuiPickersUtilsProvider 
                                utils={FnsUtils}
                            >
                                <KeyboardDatePicker
                                    variant='inline' 
                                    label='Event date'
                                    aria-label='Event date'
                                    format='MM/dd/yyyy'
                                    value={dateString}
                                    minDate={new Date()}
                                    onChange={handleEventDateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    helperText='You must enter the date the event will be on!'
                                />
                                <br />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Time picker"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    placeholder="08:00 AM"
                                    mask="__:__ _M"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                    helperText='You must select the time the event will be at!'
                               />
                            </MuiPickersUtilsProvider>
                        </div>
                        <div 
                            style={{
                                marginTop: 30,
                                textAlign: 'center',
                            }}
                        >
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1' 
                                component='p' 
                            >
                                You must upload an image that describes 
                                this event!
                            </Typography>
                            <label 
                                html-for='img' 
                            >
                                <input 
                                    className={classes.input} 
                                    type='file'
                                    name='img' 
                                    id='img' 
                                    accept='image/jpg, image/jpeg, image/png' 
                                    onChange={handleImgChange}
                                    required 
                                />
                                <Button 
                                    color='primary' 
                                    variant='contained' 
                                    component='span' 
                                >
                                    <CameraIcon />
                                </Button>
                            </label>
                        </div>
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
                                Select the city the event will take place in!
                            </Typography>
                            <Autocomplete 
                                value={city}
                                onChange={(e, newVal) => setCity(newVal)}
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
                                        placeholder='Select the city the event will take place in!' 
                                        helperText='If your city is not in the list, select the nearest city!'
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth
                                        required 
                                    />
                                )}
                            />
                        </div>
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
                                Select the state the event will take place in!
                            </Typography>
                            <Select 
                                value={eventState} 
                                onChange={e => setEventState(e.target.value)} 
                                variant='outlined' 
                                color='primary' 
                                fullWidth
                            >
                                {myStates.map((item, index) => (
                                    <MenuItem 
                                        key={index.toString()}
                                        value={item} 
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </ValidatorForm>
                    <Button 
                        variant='contained' 
                        color='primary' 
                        disabled={formSending} 
                        style={{
                            marginTop: 30,
                        }}
                        fullWidth
                        onClick={sendForm}
                    >
                        {formSending ? <CircularProgress /> : 'Create event'}
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
        primary: state.themeReducer.theme,
    };
}

export default connect(mapStateToProps)(EventBuilder);