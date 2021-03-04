import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import FnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SvgIcon from '@material-ui/core/SvgIcon';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import Icon from '@mdi/react';
import { mdiTwitter, mdiInstagram, mdiYoutube } from '@mdi/js';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import CameraIcon from '@material-ui/icons/CameraAlt';
import ChevronDownIcon from '@material-ui/icons/ExpandMore';
import swal from 'sweetalert';
import Resizer from 'react-image-file-resizer';
import { SwatchesPicker } from 'react-color';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const myCities = ["Abbeville","Aberdeen","Abilene","Abingdon","Abington","Acoma","Ada","Adams","Adrian","Aiken","Ajo","Akron","Alameda","Alamogordo","Alamosa","Albany","Albert Lea","Albuquerque","Alcoa","Alexander City","Alexandria","Alhambra","Aliquippa","Allentown","Alliance","Alma","Alpine","Alta","Alton","Altoona","Altus","Alva","Amana Colonies","Amarillo","Ambridge","American Fork","Americus","Ames","Amesbury","Amherst","Amsterdam","Anaconda","Anacortes","Anadarko","Anaheim","Anchorage","Andalusia","Anderson","Andersonville","Andover","Ann Arbor","Annapolis","Anniston","Ansonia","Antioch","Apalachicola","Appleton","Arcadia","Ardmore","Arkadelphia","Arkansas City","Arkansas Post","Arlington","Arlington Heights","Artesia","Arthur","Asbury Park","Asheboro","Asheville","Ashland","Ashtabula","Aspen","Astoria","Atchison","Athens","Athol","Atlanta","Atlantic City","Atmore","Attleboro","Auburn","Augusta","Aurora","Austin","Avondale","Babylon","Bainbridge","Baker City","Bakersfield","Baltimore","Bangor","Bar Harbor","Baraboo","Barberton","Barbourville","Bardstown","Barnstable","Barre","Barrington","Barstow","Bartlesville","Bartow","Bastrop","Batavia","Batesville","Bath","Baton Rouge","Battle Creek","Bay City","Bay Saint Louis","Bayonne","Baytown","Beacon","Beatrice","Beaufort","Beaumont","Beaverton","Beckley","Bedford","Belen","Belfast","Belle Fourche","Belle Glade","Bellefontaine","Belleville","Bellevue","Bellingham","Bellows Falls","Belmont","Beloit","Belvidere","Bemidji","Bend","Bennington","Benton","Benton Harbor","Berea","Berkeley","Berlin","Bessemer","Bethany","Bethesda-Chevy Chase","Bethlehem","Beverly","Beverly Hills","Biddeford","Big Spring","Billings","Biloxi","Binghamton","Birmingham","Bisbee","Bismarck","Blackfoot","Blairsville","Bloomfield","Bloomfield Hills","Bloomington","Bloomsburg","Bluefield","Blytheville","Boca Raton","Bogalusa","Boise","Bonners Ferry","Boone","Boonesborough","Boonville","Boothbay Harbor","Bordentown","Borger","Bossier City","Boston","Boulder","Boulder City","Bound Brook","Bountiful","Bourne","Bowie","Bowling Green","Boys Town","Bozeman","Bradenton","Bradford","Brainerd","Braintree","Branford","Branson","Brattleboro","Brea","Breckenridge","Bremerton","Bridgeport","Bridgeton","Brigham City","Brighton","Bristol","Brockton","Bronx","Brookfield","Brookings","Brookline","Brooklyn","Brownsville","Brunswick","Bryan","Buckhannon","Buena Park","Buffalo","Burbank","Burlington","Burns","Butte","Cadillac","Cahokia","Cairo","Calais","Caldwell","Calexico","Calhoun","Calistoga","Calumet City","Cambridge","Camden","Campbellsville","Canon City","Canton","Canyon","Cape Coral","Cape Girardeau","Cape May","Carbondale","Caribou","Carlinville","Carlisle","Carlsbad","Carmel","Carrollton","Carson City","Carthage","Casa Grande","Casper","Castine","Catonsville","Cedar City","Cedar Falls","Cedar Rapids","Central City","Central Falls","Centralia","Chadron","Chambersburg","Champaign","Chandler","Chanute","Chapel Hill","Charles City","Charles Town","Charleston","Charlestown","Charlevoix","Charlotte","Charlottesville","Chattanooga","Chautauqua","Cheboygan","Cheektowaga","Chelmsford","Chelsea","Cherokee","Chesapeake","Chester","Cheyenne","Chicago","Chicago Heights","Chickasaw","Chickasha","Chico","Chicopee","Chillicothe","Chula Vista","Cicero","Cincinnati","Clanton","Claremont","Claremore","Clarksburg","Clarksdale","Clarksville","Clayton","Clearfield","Clearwater","Cleburne","Cleveland","Cleveland Heights","Clifton","Climax","Clinton","Clovis","Cocoa Beach","Cocoa-Rockledge","Cody","Coeur d’Alene","Coffeyville","Cohasset","Cohoes","College Park","College Station","Collinsville","Colorado Springs","Columbia","Columbus","Compton","Concord","Coney Island","Conneaut","Connersville","Conway","Cookeville","Cooperstown","Coos Bay","Coral Gables","Cordova","Corinth","Corning","Corona","Coronado","Corpus Christi","Cortez","Cortland","Corvallis","Corydon","Costa Mesa","Coulee Dam","Council Bluffs","Council Grove","Coupeville","Coventry","Covington","Cranford","Cranston","Crawfordsville","Cripple Creek","Crookston","Crossett","Crown Point","Crystal City","Cullman","Culver City","Cumberland","Cushing","Custer","Cuyahoga Falls","Dahlonega","Dallas","Dalton","Daly City","Danbury","Danvers","Danville","Darien","Darlington","Dartmouth","Davenport","Davis","Dayton","Daytona Beach","De Land","De Smet","DeKalb","Deadwood","Dearborn","Decatur","Dedham","Deerfield Beach","Defiance","Del Rio","Delaware","Delray Beach","Delta","Deming","Demopolis","Denison","Dennis","Denton","Denver","Derby","Derry","Des Moines","Des Plaines","Detroit","Devils Lake","Dickinson","Dillon","Dixon","Dodge City","Dothan","Douglas","Dover","Downey","Dubuque","Duluth","Duncan","Dunkirk","Durango","Durant","Durham","Duxbury","Eagle Pass","East Aurora","East Chicago","East Cleveland","East Greenwich","East Hampton","East Hartford","East Haven","East Lansing","East Liverpool","East Moline","East Orange","East Point","East Providence","East Saint Louis","Eastchester","Eastham","Easton","Eastpointe","Eastport","Eau Claire","Ecorse","Edenton","Edgartown","Edinburg","Edison","Edmond","Effingham","El Centro","El Cerrito","El Dorado","El Monte","El Paso","El Reno","Elgin","Elizabeth","Elizabeth City","Elizabethton","Elizabethtown","Elk City","Elkhart","Elkins","Elko","Elkton","Ellensburg","Ellsworth","Elmhurst","Elmira","Elwood","Ely","Elyria","Emmitsburg","Emporia","Enfield","Englewood","Enid","Enterprise","Ephrata","Erie","Escanaba","Escondido","Essex","Estes Park","Estherville","Euclid","Eufaula","Eugene","Eureka","Evanston","Evansville","Eveleth","Everett","Excelsior Springs","Exeter","Fairbanks","Fairfax","Fairfield","Fairhaven","Fairmont","Fall River","Fallon","Falls Church","Falmouth","Fargo","Faribault","Farmington","Fayetteville","Fergus Falls","Ferguson","Fernandina Beach","Fillmore","Findlay","Fitchburg","Fitzgerald","Flagstaff","Flint","Florence","Florissant","Flushing","Fond du Lac","Fontana","Forest Hills","Forrest City","Fort Benton","Fort Collins","Fort Dodge","Fort Kent","Fort Lauderdale","Fort Lee","Fort Morgan","Fort Myers","Fort Payne","Fort Pierce","Fort Scott","Fort Smith","Fort Valley","Fort Walton Beach","Fort Wayne","Fort Worth","Framingham","Frankfort","Franklin","Frederick","Fredericksburg","Fredonia","Freeport","Fremont","French Lick","Fresno","Fullerton","Fulton","Gadsden","Gaffney","Gainesville","Galena","Galesburg","Gallatin","Gallipolis","Gallup","Galveston","Garden City","Garden Grove","Gardiner","Garland","Gary","Gastonia","Gatlinburg","Geneva","Genoa","Georgetown","Germantown","Gettysburg","Gila Bend","Gillette","Glassboro","Glen Ellyn","Glendale","Glendive","Glens Falls","Glenview","Glenwood Springs","Globe","Gloucester","Gloversville","Golden","Goldfield","Goldsboro","Goliad","Goshen","Grafton","Grand Forks","Grand Haven","Grand Island","Grand Junction","Grand Rapids","Granite City","Grants","Grants Pass","Grayling","Great Barrington","Great Bend","Great Falls","Great Neck","Greeley","Green Bay","Green River","Greenbelt","Greeneville","Greenfield","Greensboro","Greensburg","Greenville","Greenwich","Greenwood","Grenada","Gretna","Grinnell","Grosse Pointe","Groton","Guilford","Gulfport","Gunnison","Guntersville","Guthrie","Guymon","Hackensack","Haddonfield","Hagerstown","Haines","Halifax","Hallandale Beach","Hamden","Hamilton","Hammond","Hammondsport","Hampton","Hanalei","Hancock","Hannibal","Hanover","Harlan","Harlem","Harlingen","Harmony","Harpers Ferry","Harrisburg","Harrison","Harrodsburg","Hartford","Hartsville","Harwich","Hastings","Hattiesburg","Haverhill","Havre","Hays","Hayward","Hazard","Hazleton","Heber City","Helena","Hempstead","Henderson","Herkimer","Herrin","Hershey","Hialeah","Hibbing","Hickory","High Point","Highland Park","Hillsboro","Hillsborough","Hilo","Hingham","Hinton","Hobart","Hobbs","Hoboken","Hodgenville","Holdenville","Holland","Holly Springs","Hollywood","Holyoke","Homer","Homestead","Honaunau","Honesdale","Honolulu","Hood River","Hope","Hopewell","Hopkinsville","Hoquiam","Hot Springs","Houghton","Houlton","Houma","Houston","Hudson","Hugo","Huntington","Huntington Beach","Huntsville","Huron","Hutchinson","Hyannis","Hyattsville","Hyde Park","Idaho City","Idaho Falls","Ilion","Independence","Indiana","Indianapolis","Indianola","Indio","Inglewood","Interlochen","International Falls","Iowa City","Ipswich","Iron Mountain","Ironwood","Irvine","Irving","Irvington","Ishpeming","Ithaca","Jackson","Jacksonville","Jamestown","Janesville","Jasper","Jeannette","Jefferson City","Jeffersonville","Jersey City","Jim Thorpe","John Day","Johnson City","Johnstown","Joliet","Jonesboro","Jonesborough","Joplin","Junction City","Juneau","Kahului","Kalamazoo","Kalispell","Kanab","Kaneohe","Kankakee","Kansas City","Kapaa","Kaskaskia","Kawaihae","Kearney","Keene","Kellogg","Kelso","Kennebunkport","Kennewick","Kenosha","Kent","Keokuk","Ketchikan","Kettering","Kewanee","Key West","Keyser","Kilgore","Killeen","Kingman","Kingsport","Kingston","Kingsville","Kinston","Kirksville","Kittery","Kitty Hawk","Klamath Falls","Knoxville","Kodiak","Kokomo","Kotzebue","La Crosse","La Grande","La Grange","La Habra","La Junta","La Salle","Lackawanna","Laconia","Lafayette","Laguna Beach","Lahaina","Laie","Lake Charles","Lake City","Lake Forest","Lake Geneva","Lake Havasu City","Lake Oswego","Lake Placid","Lake Wales","Lakehurst","Lakeland","Lakeview","Lakewood","Lamar","Lancaster","Lander","Lansing","Laramie","Laredo","Largo","Las Cruces","Las Vegas","Laurel","Lawrence","Lawton","Layton","Lead","Leadville","Leavenworth","Lebanon","Lehi","Lenox","Leominster","Levittown","Lewes","Lewisburg","Lewiston","Lewistown","Lexington","Liberal","Libertyville","Lima","Lincoln","Lisle","Litchfield","Little Falls","Little Rock","Littleton","Livermore","Livingston","Livonia","Lock Haven","Lockport","Lodi","Logan","Lombard","Lompoc","Long Beach","Long Branch","Longmont","Longview","Lorain","Los Alamos","Los Angeles","Louisville","Loveland","Lovington","Lowell","Lower Southampton","Lubbock","Lubec","Ludington","Ludlow","Lufkin","Lumberton","Lynchburg","Lynn","Machias","Mackinaw City","Macomb","Macon","Madison","Magnolia","Malden","Malibu","Mamaroneck","Manassas","Manchester","Mandan","Manhattan","Manistee","Manitowoc","Mankato","Mansfield","Manti","Marblehead","Marietta","Marinette","Marion","Marlborough","Marquette","Marshall","Martinez","Martins Ferry","Martinsburg","Martinsville","Marysville","Maryville","Mason City","Massena","Massillon","Mattoon","Mayfield","Maysville","McAlester","McAllen","McCook","McKeesport","McKinney","McMinnville","McPherson","Meadville","Medford","Medicine Lodge","Melbourne","Memphis","Menasha","Menlo Park","Menominee","Mentor","Merced","Meriden","Meridian","Mesa","Mesquite","Mexico","Miami","Miami Beach","Michigan City","Middlebury","Middlesboro","Middletown","Midland","Midwest City","Milan","Milbank","Miles City","Milford","Millburn","Milledgeville","Millville","Milton","Milwaukee","Minden","Mineola","Minneapolis","Minot","Mishawaka","Mission","Missoula","Mitchell","Moab","Mobile","Mobridge","Modesto","Moline","Monett","Monmouth","Monroe","Monroeville","Montclair","Monterey","Montgomery","Monticello","Montpelier","Montrose","Moore","Moorhead","Morehead City","Morgan City","Morganton","Morgantown","Morrilton","Morristown","Moscow","Moses Lake","Moundsville","Mount Clemens","Mount Holly","Mount Pleasant","Mount Vernon","Mountain View","Muncie","Mundelein","Murfreesboro","Murray","Muscatine","Muskegon","Muskogee","Myrtle Beach","Mystic","Nacogdoches","Nags Head","Nahant","Nampa","Nanticoke","Naperville","Naples","Nappanee","Narragansett","Nashua","Nashville","Natchez","Natchitoches","Natick","Naugatuck","Nauvoo","Nebraska City","Needles","Neenah","Neosho","Nephi","New Albany","New Bedford","New Bern","New Braunfels","New Britain","New Brunswick","New Castle","New Glarus","New Harmony","New Haven","New Hope","New Iberia","New Kensington","New London","New Madrid","New Market","New Martinsville","New Milford","New Orleans","New Paltz","New Philadelphia","New Rochelle","New Smyrna Beach","New Ulm","New Windsor","New York City","Newark","Newberg","Newburgh","Newburyport","Newcastle","Newport","Newport Beach","Newport News","Newton","Niagara Falls","Niles","Nogales","Nome","Norfolk","Normal","Norman","Norris","Norristown","North Adams","North Chicago","North College Hill","North Haven","North Hempstead","North Kingstown","North Las Vegas","North Little Rock","North Platte","Northampton","Northfield","Norton","Norwalk","Norwich","Norwood","Novato","Nyack","Oak Harbor","Oak Park","Oak Ridge","Oakland","Oberlin","Ocala","Ocean City","Ocean Springs","Oceanside","Oconto","Odessa","Ogden","Ogdensburg","Oil City","Ojai","Oklahoma City","Okmulgee","Olathe","Old Saybrook","Olean","Olympia","Omaha","Oneida","Oneonta","Ontario","Opelika","Opelousas","Oraibi","Orange","Orangeburg","Orderville","Oregon","Oregon City","Orem","Orlando","Ormond Beach","Orono","Oroville","Osawatomie","Osceola","Oshkosh","Oskaloosa","Ossining","Oswego","Ottawa","Ottumwa","Ouray","Overland Park","Owatonna","Owensboro","Oxford","Oxnard","Oyster Bay","Ozark","Pacific Grove","Paducah","Pagosa Springs","Painesville","Palatine","Palatka","Palm Bay","Palm Beach","Palm Springs","Palmdale","Palmer","Palmyra","Palo Alto","Pampa","Panama City","Panguitch","Paris","Park City","Park Forest","Park Ridge","Parkersburg","Parma","Parsippany–Troy Hills","Pasadena","Pascagoula","Pasco","Pass Christian","Passaic","Paterson","Pauls Valley","Pawhuska","Pawtucket","Payson","Peabody","Pecos","Peekskill","Pekin","Pendleton","Pensacola","Peoria","Perry","Perth Amboy","Peru","Peshtigo","Petaluma","Peterborough","Petersburg","Petoskey","Pharr","Phenix City","Philadelphia","Philippi","Phoenix","Phoenixville","Pierre","Pine Bluff","Pinehurst","Pipestone","Piqua","Pittsburg","Pittsburgh","Pittsfield","Plainfield","Plains","Plainview","Plano","Plattsburgh","Plattsmouth","Plymouth","Pocatello","Point Pleasant","Point Roberts","Pomona","Pompano Beach","Ponca City","Pontiac","Port Angeles","Port Arthur","Port Gibson","Port Hueneme","Port Huron","Port Lavaca","Port Orford","Port Washington","Portage","Portales","Portland","Portsmouth","Potsdam","Pottstown","Pottsville","Poughkeepsie","Powell","Prairie du Chien","Prescott","Presque Isle","Price","Prichard","Priest River","Princeton","Prineville","Providence","Provincetown","Provo","Pryor","Pueblo","Pullman","Put-in-Bay","Puyallup","Queens","Quincy","Racine","Raleigh","Rancho Cucamonga","Randolph","Rantoul","Rapid City","Raton","Rawlins","Reading","Red Bluff","Red Cloud","Red Wing","Redding","Redlands","Redmond","Redondo Beach","Redwood City","Reedsport","Reno","Rensselaer","Renton","Reston","Revere","Rexburg","Rhinelander","Richardson","Richland","Richmond","Ridgewood","Ripon","River Forest","Riverside","Riverton","Roanoke","Rochester","Rock Hill","Rock Island","Rock Springs","Rockford","Rockland","Rockville","Rocky Mount","Rogers","Rolla","Rome","Romney","Roseburg","Roselle","Roseville","Roswell","Rotterdam","Royal Oak","Rugby","Rumford","Ruston","Rutherford","Rutland","Rye","Saco","Sacramento","Sag Harbor","Saginaw","Saint Albans","Saint Augustine","Saint Charles","Saint Cloud","Saint George","Saint Ignace","Saint Johnsbury","Saint Joseph","Saint Louis","Saint Martinville","Saint Marys City","Saint Paul","Saint Petersburg","Sainte Genevieve","Salem","Salina","Salinas","Salisbury","Sallisaw","Salt Lake City","San Angelo","San Antonio","San Bernardino","San Clemente","San Diego","San Felipe","San Fernando","San Francisco","San Gabriel","San Jose","San Juan Capistrano","San Leandro","San Luis Obispo","San Marcos","San Marino","San Mateo","San Pedro","San Rafael","San Simeon","Sand Springs","Sandusky","Sandwich","Sanford","Santa Ana","Santa Barbara","Santa Clara","Santa Clarita","Santa Claus","Santa Cruz","Santa Fe","Santa Monica","Santa Rosa","Sapulpa","Saranac Lake","Sarasota","Saratoga Springs","Saugus","Sauk Centre","Sault Sainte Marie","Sausalito","Savannah","Scarborough","Scarsdale","Schenectady","Scottsboro","Scottsdale","Scranton","Searcy","Seaside","Seattle","Sebring","Sedalia","Selma","Seminole","Seneca Falls","Seward","Seymour","Shaker Heights","Shamokin","Sharon","Shawnee","Shawneetown","Sheboygan","Sheffield","Shelby","Shelbyville","Shelton","Shepherdstown","Sheridan","Sherman","Shiprock","Shreveport","Sidney","Sierra Vista","Silver City","Silver Spring","Silverton","Simi Valley","Simsbury","Sioux City","Sioux Falls","Sitka","Skagway","Skokie","Smith Center","Smyrna","Socorro","Somersworth","Somerville","Sonoma","South Bend","South Charleston","South Hadley","South Holland","South Kingstown","South Orange Village","South Saint Paul","South San Francisco","Southampton","Southington","Spanish Fork","Sparks","Spartanburg","Spearfish","Spokane","Spring Green","Springfield","Springville","Stamford","Starkville","State College","Staten Island","Staunton","Steamboat Springs","Sterling","Steubenville","Stevens Point","Stillwater","Stockbridge","Stockton","Stonington","Stony Brook","Stony Point","Stoughton","Stratford","Streator","Stroudsburg","Sturbridge","Sturgeon Bay","Sturgis","Stuttgart","Sudbury","Suffolk","Summersville","Summit","Sumter","Sun Valley","Sunbury","Sunnyvale","Superior","Susanville","Swarthmore","Sweetwater","Sylacauga","Syracuse","Tacoma","Tahlequah","Takoma Park","Talladega","Tallahassee","Tamaqua","Tampa","Taos","Tarpon Springs","Tarrytown","Taunton","Telluride","Tempe","Temple","Ten Sleep","Terre Haute","Tewksbury","Texarkana","Texas City","The Dalles","The Village","Thermopolis","Thibodaux","Thousand Oaks","Ticonderoga","Tiffin","Tillamook","Titusville","Tiverton","Toccoa","Toledo","Tombstone","Tonawanda","Tooele","Topeka","Torrance","Torrington","Totowa","Towson","Traverse City","Trenton","Trinidad","Troy","Truro","Truth or Consequences","Tucson","Tucumcari","Tullahoma","Tulsa","Tupelo","Turlock","Tuscaloosa","Tuscumbia","Tuskegee","Twin Falls","Tyler","Ukiah","Union","Union City","Uniontown","Urbana","Utica","Uvalde","Vail","Valdez","Valdosta","Vallejo","Valley City","Valparaiso","Van Buren","Vancouver","Vandalia","Venice","Ventura","Vermillion","Vernal","Vicksburg","Victoria","Victorville","Vincennes","Vineland","Vinita","Virden","Virginia","Virginia Beach","Virginia City","Visalia","Wabash","Waco","Wahiawa","Wahpeton","Wailuku","Waimea","Walla Walla","Wallingford","Walnut Creek","Walpi","Walsenburg","Warm Springs","Warner Robins","Warren","Warrensburg","Warwick","Washington","Waterbury","Waterford","Waterloo","Watertown","Waterville","Watervliet","Watkins Glen","Watts","Waukegan","Waukesha","Wausau","Wauwatosa","Waycross","Wayne","Waynesboro","Weatherford","Webster","Webster City","Weehawken","Weirton","Welch","Wellesley","Wellfleet","Wellsburg","Wenatchee","West Allis","West Bend","West Bridgewater","West Chester","West Covina","West Des Moines","West Hartford","West Haven","West Lafayette","West Memphis","West New York","West Orange","West Palm Beach","West Plains","West Point","West Seneca","West Springfield","Westerly","Westfield","Westminster","Weston","Westport","Wethersfield","Wewoka","Weymouth","Wheaton","Wheeling","White Plains","White Springs","White Sulphur Springs","Whitman","Whittier","Wichita","Wichita Falls","Wickford","Wilkes-Barre","Williamsburg","Williamson","Williamsport","Williamstown","Willimantic","Willingboro","Williston","Willmar","Wilmette","Wilmington","Wilson","Winchester","Windham","Window Rock","Windsor","Windsor Locks","Winnemucca","Winnetka","Winona","Winooski","Winslow","Winsted","Winston-Salem","Winter Haven","Winter Park","Wisconsin Dells","Woburn","Wood River","Woodbridge","Woodland","Woods Hole","Woodstock","Woodward","Woonsocket","Wooster","Worcester","Worland","Worthington","Wyandotte","Xenia","Yakima","Yankton","Yazoo City","Yellow Springs","Yonkers","Yorba Linda","York","Youngstown","Ypsilanti","Ysleta","Yuba City","Yuma","Zanesville","Zion"];

const myStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const myColleges = ["None","Abilene Christian University","Adelphi University","Agnes Scott College","Air Force Institute of Technology","Alabama A&M University","Alabama State University","Alaska Pacific University","Albertson College of Idaho","Albion College","Alderson-Broaddus College","Alfred University","Allegheny College","Allentown College of Saint Francis de Sales","Alma College","Alverno College","Ambassador University","American Coastline University","American Graduate School of International Management","American International College","American University","Amherst College","Andrews University","Angelo State University","Antioch College","Antioch New England","Antioch University-Los Angeles","Antioch University-Seattle","Appalachian State University","Aquinas College","Arizona State University","Arizona State University East","Arizona State University West","Arizona Western College","Arkansas State University, Jonesboro","Arkansas Tech University","Armstrong State College","Ashland University","Assumption College","Athens State College","Auburn University","Auburn University - Montgomery","Augsburg College","Augustana College (IL)","Augustana College (SD)","Aurora University","Austin College","Austin Peay State University","Averett College","Avila College","Azusa Pacific University", "Babson College","Baldwin-Wallace College","Ball State University","Baker University","Baptist Bible College","Bard College","Barry University","Bastyr University","Bates College","Baylor College of Medicine","Baylor University","Beaver College","Belmont University","Beloit College","Bemidji State University","Benedictine College","Bennington College","Bentley College","Berea College","Berklee College of Music","Bethany College (CA)","Bethany College (WV)","Bethel College (KS)","Bethel College and Seminary (MN)","Biola University","Birmingham-Southern College","Black Hills State University","Bloomsburg University of Pennsylvania","Bluffton College","Bob Jones University","Boise State University","Boston College","Boston Graduate School of Psychoanalysis","Boston University","Bowdoin College","Bowie State University","Bowling Green State University","Bradley University","Brandeis University","Brenau University","Briar Cliff College","Bridgewater College","Brigham Young University","Brigham Young University Hawaii","Brown University","Bryant College","Bryn Mawr College","Bucknell University","Buena Vista University","Butler University","California Coast University","California Institute of Technology","California Lutheran University","California Maritime Academy","California National University","California Pacific University","California Polytechnic State University, San Luis Obispo","California School of Professional Psychology","California State Polytechnic University, Pomona","California State University System","California State University, Bakersfield","California State University, Chico","California State University, Dominguez Hills","California State University, Fresno","California State University, Fullerton","California State University, Hayward","California State University, Long Beach","California State University, Los Angeles","California State University, Monterey Bay","California State University, Northridge","California State University, Sacramento","California State University, San Bernardino","California State University, San Jose","California State University, San Marcos","California State University, Sacramento","California State University, Stanislaus","California University of Pennsylvania","Calvin College","Campbell University","Campbellsville College","Cameron University","Canisius College","Carleton College","Carlow College","Carnegie Mellon University","Carroll College (MT)","Carroll College (WI)","Carson-Newman College","Carthage College","Case Western Reserve University","Castleton State University","The Catholic University of America","Cedarville College","Centenary College of Louisiana","Central College","Central Connecticut State University","Central Methodist College","Central Michigan University","Central Missouri State University","Central Washington University","Centre College","Chadron State College","Champlain College","Chapman University","Chatham College","Chesapeake College","Cheyney University","The Chicago School of Professional Psychology","Christian Brothers University","Christian Theological Seminary","Christopher Newport University","The Citadel","City University","City University of New York","Claremont Graduate School","Claremont McKenna College","Clarion University of Pennsylvania","Clark University","Clarke College","Clarkson University","Clayton State College","Clemson University","Cleveland State University","Clinch Valley College","Coastal Carolina University","Coe College","Coker College","Colby College","Colgate University","College of the Atlantic","College of Charleston","College of Eastern Utah","College of the Holy Cross","College of Saint Benedict","College of Saint Catherine","College of St. Francis","College of Saint Rose","College of St. Scholastica","College of William and Mary","The College of Wooster","Colorado Christian University","Colorado College","Colorado School of Mines","Colorado State University","Columbia College Chicago","Columbia Southern University","Columbia Union College","Columbia University","Concordia College-Ann Arbor","Concordia College-Moorhead","Concordia College-St. Paul","Concordia College-Seward","Concordia University River Forest, Illinois","Connecticut College","The Cooper Union for the Advancement of Science and Art","Coppin State College","Cornell College","Cornell University","Cornerstone College","Creighton University","Curry College", "Daemen College","Dakota State University","Dakota Wesleyan University","Dallas Baptist University","Dana College","Daniel Webster College","Dartmouth College","Davenport College Detroit College of Business","Davidson College","Davis & Elkins College","Delaware State University","Delta State University","Denison University","DePaul University","DePauw University","DeVry Institute of Technology","DeVry Institute of Technology-Dallas","DeVry Institute of Technology-Phoenix","Dickinson College","Dickinson State University","Dillard University","Dominican College","Dordt College","Dowling College","Drake University","Drew University","Drexel University","Drury College","Duke University","Duquesne University","Earlham College","East Carolina University","East Central University","East Stroudsburg State University of Pennsylvania","East Tennessee State University","East Texas State University","Eastern Connecticut State University","Eastern Illinois University","Eastern Kentucky University","Eastern Mennonite University","Eastern Michigan University","Eastern Nazarene College","Eastern New Mexico University","Eastern Oregon State College","Eastern Washington University","Edgewood College","Edinboro University of Pennsylvania","Elizabeth City State University","Elizabethtown College","Elmhurst College","Elon College","Embry-Riddle Aeronautical University, Arizona","Embry-Riddle Aeronautical University, Florida","Emerson College","Emmanuel College","Emmaus Bible College","Emporia State University","Emory & Henry College","Emory University","Evergreen State College","Fairfield University","Fairleigh Dickinson University","Fairmont State College","Fayetteville State University","Ferris State University","Fielding Institute","Fisk University","Fitchburg State College","Florida Agricultural and Mechanical University","Florida Atlantic University","Florida Gulf Coast University","Florida Institute of Technology","Florida International University","Florida State University","Fontbonne College","Fordham University","Fort Hays State University","Fort Lewis College","Franciscan University","Franklin and Marshall College","Franklin Pierce Law Center","Franklin University","Fresno Pacific University","Friends University","Frostburg State University","Fuller Theological Seminary","Furman University","Gallaudet University","Gannon University","Geneva College","George Fox College","George Mason University","George Washington University","Georgetown University","Georgia College","Georgia Institute of Technology","Georgia Southern University","Georgia Southwestern College","Georgia State University","Georgian Court College","Gettysburg College","GMI Engineering and Management Institute","Golden Gate University","Goldey-Beacom College","Gonzaga University","Goshen College","Goucher College","Governors State University","Grace College","Graceland College","Grand Valley State University","Greenleaf University","Grinnell College","Guilford College","Gustavus Adolphus College","Gutenberg College","Hamilton College","Hamline University","Hampden-Sydney College","Hampshire College","Hampton University","Hanover College","Harding University","Hartwick College","Harvard University","Harvey Mudd College","Haskell Indian Nations University","Hastings College","Haverford College in Pennsylvania","Hawaii Pacific University","Heidelberg College","Hendrix College","Hesston College","High Point University","Hillsdale College","Hiram College","Hobart and William Smith Colleges","Hofstra University","Hollins College","Holy Cross College","Hood College","Hope College","Howard University","Humboldt State University","Hunter College","Huntingdon College","Huntington College","ICI University","Idaho State University","Illinois Benedictine College","Illinois Institute of Technology","Illinois State University","Incarnate Word College","Indiana Institute of Technology","Indiana State University","Indiana University System","Indiana University/Purdue University at Columbus","Indiana University/Purdue University at Fort Wayne","Indiana University/Purdue University at Indianapolis","Indiana University at Bloomington","Indiana University at South Bend","Indiana University of Pennsylvania","Indiana University Southeast at New Albany","Indiana Wesleyan University, Marion","Inter American University of Puerto Rico Metropolitan Campus","Iona College","Iowa State University","Ithaca College","Jackson State University","Jacksonville University","Jacksonville State University","James Madison University","Jamestown College","The Jewish Theological Seminary","John Brown University","John F. Kennedy University","Johns Hopkins University","Johnson Bible College","Johnson C. Smith University","Johnson & Wales University","Johnson & Wales University-Charleston","Jones College","Judson College","Juniata College","Kalamazoo College","Kansas State University","Kansas Wesleyan University","Kean College","Keene State College","Kent State University","Kenyon College","King's College","Knox College","Kutztown University of Pennsylvania","La Sierra University","LaGrange College","Lafayette College","Lake Forest College","Lake Superior State University","Lamar University","Langston University","LaSalle University","Lawrence University","Lawrence Technological University","Lebanon Valley College","Lehigh Univervsity","Le Moyne College","Lenoir-Rhyne College","LeTourneau University","Lewis & Clark College","Lewis-Clark State College","Lewis University","Liberty University","Lincoln University","Linfield College","Lock Haven University of Pennsylvania","Loma Linda University","Long Island University","Longwood College","Loras College","Louisiana College","Louisiana State University","Louisiana State University at Alexandria","Louisiana State University at Shreveport","Louisiana Tech University","Loyola College","Loyola Marymount University","Loyola University Chicago","Luther College","Luther Seminary","Lycoming College","Lynchburg College","Lyndon State College","Lyon College","Macalester College","Maharishi University of Management","Maine Maritime Academy","Malone College","Manhattan College","Mankato State University","Mansfield University of Pennsylvania","Marietta College","Marist College","Marlboro College","Marquette University","Marshall University","Mary Baldwin College","Marymount College","Marymount University","Mary Washington College","Massachusetts Institute of Technology","McMurry University","McNeese State University","Medical College of Georgia","Medical College of Wisconsin","Mercer University","Mercyhurst College","Meredith College","Messiah College","Metropolitan State College of Denver","Metropolitan State University","Miami Christian University","Michigan State University","Michigan Technological University","Mid-America Nazarene College","Middlebury College","Middle Georgia College","Middle Tennessee State University","Midwestern State University","Millersville University of Pennsylvania","Milligan College","Millikin University","Millsaps College","Milwaukee School of Engineering","Minot State University","Minneapolis College of Art and Design","Mississippi College","Mississippi State University","Mississippi University for Women","Missouri Southern State College","Missouri Western State College","Molloy College","Monmouth College","Monmouth University","Montana State University-Billings","Montana State University-Bozeman","Montana State University-Northern","Montana Tech","Montclair State University","Montreat College","Moravian College","Moorhead State University","Morehouse College","Morgan State University","Mount Senario College","Mount Holyoke College","Mount Saint Joseph College","Mount Saint Mary College","Mount Union College","Murray State University","Muskingum College","National Defense University","National-Louis University","National Technological University","National University","Naval Postgraduate School","Nazareth College","Newberry College","New England Institute of Technology","New College of California","New Hampshire College","New Jersey Institute of Technology","New Mexico Highlands University","New Mexico Institute of Mining & Technology","New Mexico State University","New York Institute of Technology","New York University","Niagara University","Nicholls State University","Norfolk State University","North Adams State College","North Carolina Central University","North Carolina A&T State University","North Carolina State University","North Carolina Wesleyan College","North Central Bible College","North Dakota State University","Northland College","North Park College and Theological Seminary","Northeastern Illinois University","Northeastern Louisiana University","Northeastern State University","Northeastern University","Northern Arizona University","Northern Illinois University","Northern Kentucky University","Northern Michigan University","Northern State University","Northwest Missouri State University","Northwest Nazarene College","Northwestern College of Iowa","Northwestern State University","Northwestern University","Norwich University","Nova Southeastern University","Oakland University","Oberlin College","Occidental College","Ohio Dominican College","Ohio Northern University","Ohio State University, Columbus","Ohio State University, Marion","Ohio Wesleyan University","Ohio University, Athens","Oklahoma Baptist University","Oklahoma City University","Oklahoma State University","Old Dominion University","Olivet Nazarene University","Oral Roberts University","Oregon Graduate Institute of Science and Technology","Oregon Health Sciences University","Oregon Institute of Technology","Oregon State University","Otterbein College","Our Lady of the Lake University","Pace University","Pacific Lutheran University","Pacific Union College","Pacific University","Pacific Western University","Palm Beach Atlantic College","Peace College","Pembroke State University","Pennsylvania State System of Higher Education","Pennsylvania State University","Pennsylvania State University-Schuylkill Campus","Pensacola Christian College","Pepperdine University","Peru State College","Philadelphia College of Textiles and Science","Phillips University","Pittsburg State University","Pitzer College","Platt College","Plymouth State College","Point Loma Nazarene College","Polytechnic University of New York","Polytechnic University of Puerto Rico","Pomona College","Portland State University","Prairie View A&M University","Pratt Institute","Prescott College","Princeton University","Presbyterian College","Providence College","Purdue University","Purdue University Calumet","Purdue University North Central","Quincy University","Quinnipiac College","Radford University","Ramapo College","Randolph-Macon College","Randolph-Macon Woman's College","Reed College","Regent University","Regis University","Rensselaer Polytechnic Institute","Rhode Island College","Rhodes College","Rice University","Richard Stockton College of New Jersey","Rider University","Ripon College","Rivier College","Roanoke College","Rochester Institute of Technology","The Rockefeller University","Rockford College","Rockhurst College","Rocky Mountain College","Roger Williams University","Rollins College","Rosary College","Rose-Hulman Institute of Technology","Rowan College","Rutgers University","Rutgers University, Camden","Rutgers University, Newark","The Sage Colleges","Sacred Heart University (CT)","Sacred Heart University (PR)","Saginaw Valley State University","St. Ambrose University","St. Andrews Presbyterian College","Saint Anselm College","St. Bonaventure University","Saint Cloud State University","Saint Edward's University","Saint Francis College","St. John's College-Annapolis","St. John's College-Santa Fe","Saint John's University (MN)","Saint John's University (NY)","St. Joseph College (CT)","Saint Joseph's College (IN)","St. Joseph's College (ME)","Saint Joseph's University","St. Lawrence University","St. Louis College of Pharmacy","Saint Louis University","St. Martin's College","Saint Mary College","Saint Mary's College (IN)","Saint Mary's College of California","Saint Mary's University of Minnesota","Saint Michael's College","Saint Olaf College","St. Thomas University (FL)","Saint Vincent College","Saint Xavier University","Salisbury State University","Salish Kootenai College","Sam Houston State University","Samford University","San Diego State University","San Francisco State University","San Jose State University","Santa Clara University","Sarah Lawrence College","School of the Art Institute of Chicago","Seattle Pacific University","Seattle University","Seton Hall University","Sewanee, University of the South","Shawnee State University","Shenandoah University","Shippensburg University of Pennsylvania","Shorter College","Simmons College","Simon's Rock College","Simpson College","Skidmore College","Slippery Rock University of Pennsylvania","Smith College","Sonoma State University","South Dakota School of Mines and Technology","South Dakota State University","Southeast Missouri State University","Southeastern Louisiana University","Southern College","Southern College of Technology","Southern Connecticut State University","Southern Illinois University","Southern Illinois University-Carbondale","Southern Illinois University-Edwardsville","Southern Methodist University","Southern Nazarene University","Southern Oregon State College","Southern University","Southern Utah University","Southampton College","South Texas College of Law","Southwest Baptist University","Southwest Missouri State University","Southwest State University","Southwest Texas State University","Southwestern Adventist College","Southwestern University","Spelman College","Spring Arbor College","Spring Hill College","Stanford University","State University of New York System","State University of New York at Albany","State University of New York College of Technology at Alfred","State University of New York at Binghamton","State University of New York College at Brockport","State University of New York at Buffalo","State University of New York College at Buffalo (Buffalo State College)","State University of New York College of Agriculture and Technology at Cobleskill","State University of New York College at Cortland","State University of New York College of Environmental Science and Forestry","State University of New York at Farmingdale","State University of New York at Fredonia","State University of New York College at Geneseo","State University of New York College at New Paltz","State University of New York College at Oneonta","State University of New York at Oswego","State University of New York at Plattsburgh","State University of New York College at Potsdam","State University of New York at Stony Brook","State University of New York Institute of Technology at Utica/Rome","Stephen F. Austin State University","Stephens College","Stetson University","Stevens Institute of Technology","Strayer College","Suffolk University","Sul Ross State University","Summit University of Louisiana","Susquehanna University","Swarthmore College","Sweet Briar College","Syracuse University","Tabor College","Tarleton State University","Taylor University","Teachers College, Columbia University","Teikyo Marycrest University","Temple University","Tennessee State University","Tennessee Technological University","Texas A&M International University","Texas A&M University-College Station","Texas A&M University-Corpus Christi","Texas A&M University-Kingsville","Texas Christian University","Texas Southern University","Texas Tech University","Texas Tech University-Health Sciences Center","Texas Woman's University","Thomas College","Thomas Edison State College","Thomas Jefferson University","Thomas More College","Towson State University","Transylvania University","Trenton State College","Trinity College (CT)","Trinity College (DC)","Trinity University","Troy State University","Truman State University","Tucson University","Tufts University","Tulane University","Tuskegee University","Union College","The Union Institute","Union University","United States Air Force Academy","United States International University","United States Merchant Marine Academy","United States Military Academy","United States Naval Academy","The Uniformed Services University of the Health Sciences","Ursinus College","Ursuline College","UA-B","University of Akron","University of Alabama at Birmingham","University of Alabama at Huntsville","University of Alabama at Tuscaloosa","University of Alaska","University of Alaska-Anchorage","University of Alaska-Fairbanks","University of Alaska-Southeast","University of Arizona","University of Arkansas - Fayetteville","University of Arkansas - Little Rock","University of Arkansas for Medical Sciences","University of Arkansas - Monticello","University of Baltimore","University of Bridgeport","UC","University of California, Berkeley","University of California, Davis","University of California, Irvine","University of California, Los Angeles","University of California, Riverside","University of California, San Diego","University of California, San Francisco","University of California, Santa Barbara","University of California, Santa Cruz","University of Central Arkansas","University of Central Florida","University of Central Texas","University of Charleston","University of Chicago","University of Cincinnati","University of Colorado at Boulder","University of Colorado at Colorado Springs","University of Colorado at Denver","University of Colorado Health Sciences Center","University of Connecticut","UD-H","University of Dallas","University of Dayton","University of Delaware","University of Denver","University of the District of Columbia","University of Detroit Mercy","University of Dubuque","University of Evansville","University of Florida","University of Georgia","University of Great Falls","University of Guam","University of Hartford","University of Hawaii at Hilo Physics and Astronomy","University of Hawaii at Manoa","University of Houston","UI-L","University of Idaho","University of Illinois at Chicago","University of Illinois at Springfield","University of Ilinois at Urbana-Champaign","University of Indianapolis","University of Iowa","University of Kansas","University of Kansas School of Medicine","University of Kentucky","University of La Verne","University of Louisville","UM","University of Maine System","University of Maine","University of Maine at Farmington","University of Maine at Fort Kent","University of Maine at Machias","University of Maine at Presque Island","University of Maryland at Baltimore","University of Maryland at Baltimore County","University of Maryland at College Park","University of Maryland - University College","University of Massachusetts System","University of Massachusetts at Amherst","University of Massachusetts at Dartmouth","University of Massachusetts at Lowell","University of Memphis","University of Miami","University of Michigan-Ann Arbor","University of Michigan-Dearborn","University of Minnesota","University of Minnesota-Crookston","University of Minnesota-Duluth","University of Minnesota-Morris","University of Minnesota-Twin Cities","University of Mississippi","University of Mississippi Medical Center","University of Missouri System","University of Missouri-Columbia","University of Missouri-Kansas City","University of Missouri-Rolla","University of Missouri-Saint Louis","University of Montana","UN","University of Nebraska, Kearney","University of Nebraska, Lincoln","University of Nebraska, Omaha","University of Nevada, Las Vegas","University of Nevada, Reno","University of New England","University of New Hampshire, Durham","University of New Haven","University of New Mexico","University of New Orleans","University of North Carolina at Asheville","University of North Carolina at Chapel Hill","University of North Carolina at Charlotte","University of North Carolina at Greensboro","University of North Carolina System","University of North Carolina at Wilmington","University of North Dakota","University of North Florida","University of North Texas","University of North Texas Health Science Center","University of Northern Colorado","University of Northern Iowa","University of Notre Dame","UO-S","University of Oklahoma","University of Oregon","University of the Ozarks","University of the Pacific","University of Pennsylvania","University of Phoenix","University of Pittsburgh","University of Pittsburgh at Johnstown","University of Portland","University of Puerto Rico","University of Puget Sound","University of Redlands","University of Rhode Island","University of Richmond","University of Rochester","University of San Diego","University of San Francisco","University of Sarasota","University of Science & Arts of Oklahoma","University of Scranton","University of Sioux Falls","University of Southern California","University of South Carolina","University of South Carolina - Aiken","University of South Dakota","University of South Florida","University of Southern Maine","University of Southern Mississippi","University of Southwestern Louisiana","University of Saint Thomas","University of Saint Thomas (MN)","University of South Alabama","University of Southern Colorado","University of Southern Indiana","UT","University of Tampa","University of Tennessee, Knoxville","University of Tennessee, Martin","University of Texas System","University of Texas at Arlington","University of Texas at Austin","University of Texas at Brownsville","University of Texas at Dallas","University of Texas at El Paso","University of Texas-Pan American","University of Texas at San Antonio","University of Texas Health Science Center at Houston","University of Texas Health Science Center at San Antonio","University of Texas at Tyler","University of Texas Health Center at Tyler","University of Texas M.D. Anderson Cancer Center","University of Texas Medical Branch","University of Texas Southwestern Medical Center at Dallas","University of Toledo","University of Tulsa","UU-W","University of Utah","University of Vermont","University of the Virgin Islands","University of Virginia, Charlottesville","University of Washington","University of West Alabama","University of West Florida","University of Wisconsin System","University of Wisconsin-Eau Claire","University of Wisconsin-Green Bay","University of Wisconsin-LaCrosse","University of Wisconsin-Madison","University of Wisconsin-Milwaukee","University of Wisconsin-Oshkosh","University of Wisconsin-Parkside","University of Wisconsin-Platteville","University of Wisconsin-River Falls","University of Wisconsin-Stevens Point","University of Wisconsin-Stout","University of Wisconsin-Superior","University of Wisconsin-Whitewater","University of Wyoming","Upper Iowa University","Utah State University","Utah Valley State College","Valley City State University","Valdosta State University","Valparaiso University","Vanderbilt University","Vassar College","Vermont Technical College","Villa Julie College","Villanova University","Virginia Commonwealth University","Virginia Intermont College","Virginia Military Institute","Virginia Polytechnic Institute and State University","Virginia State University","Virginia Wesleyan College","Wabash College","Wake Forest University","Walden University","Walla Walla College","Warren Wilson College","Wartburg College","Washburn University","Washington Bible College/Capital Bible Seminary","Washington & Lee University","Washington College","Washington State University","Washington State University at Tri-Cities","Washington State University at Vancouver","Washington University, Saint Louis","Wayne State University","Waynesburg College","Webster University","Wellesley College","Wells College","Wentworth Institute of Technology","Wesley College","Wesleyan University","West Chester University of Pennsylvania","West Coast University","West Georgia College","West Liberty State College","West Texas A&M University","West Virginia University","West Virginia University at Parkersburg","Western Carolina University","Western Connecticut State University","Western Illinois University","Western Kentucky University","Western Maryland College","Western Michigan University","Western Montana College","Western New England College","Western New Mexico University","Western State College","Western Washington University","Westfield State College","Westminster College","Westminster College","Westminster College of Salt Lake City","Westminster Theological Seminary","Westmont College","Wheaton College","Wheaton College, Norton MA","Wheeling Jesuit College","Whitman College","Whittier College","Whitworth College","Wichita State University","Widener University","Wilberforce University","Wilkes University","Willamette University","William Howard Taft University","William Jewell College","William Mitchell College of Law","William Penn College","William Paterson College","William Woods University","Williams College","Wilmington College","Winona State University","Winthrop University","Wittenberg University","Wofford College","Woodbury University","Worcester Polytechnic Institute","Wright State University","Xavier University of Louisiana","Yale University","Yeshiva University","York College of Pennsylvania","Youngstown State University"];

const interestsList = [
    'Accounting', 'Activism', 'Animals And Pets', 'Art', 'Astrology', 'Athletes', 'Aviation', 'Bars', 'Baseball', 'Beauty And Makeup', 'Biking', 'Black Lives Matter', 'Brands/Products', 'Business', 'Careers', 'Cars And Motor Vehicles', 
    'Celebrity', 'College Baseball', 'College Basketball', 'College Football', 'Computer Science', 'Crafts And DYI', 'Crossfit', 'Crypto', 'Culture Race And Ethnicity', 'Dancing', 'Day Trading', 'Documentaries','Economics',
    'Education', 'Electronics', 'Entertainment', 'Ethics And Philosophy', 'Family And Relationships', 'Fashion', 'Filming', 'Fitness And Nutrition', 'Food And Drink', 'Funny/Humor',
    'Gaming', 'Gender', 'GeoCities', 'Greek Life', 'Hair', 'Health', 'History', 'Hobbies', 'Hockey', 'Home And Garden', 'Investing', 'International Culture', 'Internet Culture', 'Intramural Sports', 'Latin Culture', 'Marijuna', 'Marketplace And Deals',
    'Mature Themes And Adult Content', 'Medical And Mental Health', 'Meditation', "Men's Health", 'Military', 'Movies', 'Music', 'NBA', 'NFL', 'NHL', 'Nursing', 'Only Fans',
    'Outdoors And Nature', 'Partying', 'People', 'Personal Connections', 'Photography', 'Podcasts And Streamers', 'Politics', 'Pop Culture', 'Programming', 'Public Policy', 'Reading Writing And Literature', 
    'Religion And Spirituality', 'Robinhood Trading', 'Rowing', 'Running', 'Science', 'Sexual Health And Orientation', 'Side Hustle', 'Sports', 'Soccer', 'Social Justice', 'Software Engineering', 'Streaming', 'Tabletop Games', 'Television', 'Television Personalities', 'Theatre', 'Track & Field', 'Volleyball',
    "Women's Health", 'World News', 'Working Out/Gym', 'Work/Labor',
];


const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    card: {
        margin: 'auto',
        maxWidth: 450,
    },
    topField: {
        marginTop: 20,
    },
    topMarg: {
        marginTop: 30,
    },
    input: {
        display: 'none',
    },
}));

function Signup(props) {
    let facebookName; //This variable will store the users first and last name from Facebook
    const classes = useStyles(); //Styles for the component.
    const history = useHistory(); //Browser window history for routing. 
    const [open, setOpen] = useState(false); //Open variable for the backdrop when the form sent to the server.
    const formRef = useRef(null); //Ref for the ValidatorForm component.
    const [username, setUsername] = useState(''); //Username for the user.
    const [password, setPasssword] = useState(''); //Password for the user.
    const [firstName, setFirstname] = useState(''); //First name of the user.
    const [lastName, setLastname] = useState(''); //Last name of the user.
    const [email, setEmail] = useState(''); //Email of the user. Will need some regex rules.
    const [town, setTown] = useState(myCities[0]); //The users hometown will come from a list of towns.
    const [userState, setUserState] = useState(myStates[0]); //This will be the home state that the user is from.
    const [college, setCollege] = useState(myColleges[0]); //This will be the college the user attended. "None" if they didn't attend one. 
    const [birthdate, setBirthDate] = useState(new Date(1989, 0, 1)); //The user must select a birthdate. 
    const [interests, setInterests] = useState([]); //An empty array that will store the interests for a user.
    const [twitterHandle, setTwitterHandle] = useState(''); //The twitter handle for the user. 
    const [instaHandle, setInstaHandle] = useState(''); //Sets the Instagram handle for the user. 
    const [youtubeChannel, setYoutubeChannel] = useState(''); //Sets the Youtube channel for the user. 
    const [avatar, setAvatar] = useState(null); //This will store the Avatar for the user. 
    const [profileTheme, setProfileTheme] = useState('#00143C'); //This will set the profile theme color for the user. 
    const [agreeToTerms, setAgreeToTerms] = useState(false); //This will check to see if the user agrees to the terms of service. 
    const [bio, setBio] = useState(''); //This will store the mini bio the user creates for their profile.
    const [currentLocation, setCurrentLocation] = useState({}); //Object that will store keys for the users current latitude and longitude. 
    const regularExpressions = {
        usernameExpression: /^\w+$/,
        alphaStartRe: /^[A-Za-z]+$/,
        emailRe: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    }; //Regular expressions to make sure username is valid. 
    useEffect(() => {
        //First, if the user is not null, we need to route them to the profile page of the user. 
        if(props.user) {
            history.push('/profile'); //For now we will go back, but in the future we will go to the profile page.
        }
        props.dispatch({type: 'ThemeChange', payload: 'rgb(0, 20, 60)'}); //Change to the default theme color.
        //Second we will get the current Geolocation of the user if they've enabled location tracking. 
        if("geolocation" in navigator) {
            //If the user has enabled geolocation, get the current position and save latitude and longitude for currentLocation.
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
              }, function(err) {
                  //Error callback for location tracking. Set currentPosition to null.
                  console.log(err.message);
                  setCurrentLocation(null);
              });
        }
        else {
            //Else, if the user has not enabled Geolocation, set the currentLocation to null. 
            console.log('User has not given Geolocation permissions');
            setCurrentLocation(null);
        }

        //This validation rule will ensure that the username follows the proper regex rules. 
        ValidatorForm.addValidationRule('usernameValid', v => {
            if(!regularExpressions.usernameExpression.test(v)) {
                return false;
            }
            else {
                return true;
            }
        });

        //This rule will ensure that the username and password is at least 6 characters. 
        ValidatorForm.addValidationRule('enoughCharacters', v => {
            if(v.length < 6) {
                return false;
            }
            else {
                return true;
            }
        });

        //This rule will ensure that a username starts with an Alphanumberic character. 
        ValidatorForm.addValidationRule('validStartChar', v => {
            if(!regularExpressions.alphaStartRe.test(v.slice(0, 1))) {
                return false;
            }
            else {
                return true;
            }
        });

        //This rule will ensure that a username is not more than 24 characters long.
        ValidatorForm.addValidationRule('tooManyChars', v => {
            if(v.length > 24) {
                return false;
            }
            else {
                return true;
            }
        });

        //This rule will make sure the length of certain fields are valid 
        ValidatorForm.addValidationRule('isFilled', v => {
            if(v.length < 1) {
                return false;
            }
            else {
                return true;
            }
        });

        //This rule will ensure that emails have a valid email format 
        ValidatorForm.addValidationRule('mailValid', v => {
            if(!regularExpressions.emailRe.test(v)) {
                return false;
            }
            else {
                return true;
            }
        });

        ValidatorForm.addValidationRule('minBio', v => {
            if(v.length < 20) {
                return false;
            }
            else {
                return true;
            }
        });

        ValidatorForm.addValidationRule('maxBio', v => {
            if(v.length > 300) {
                return false;
            }
            else {
                return true;
            }
        });

    }, []);

    function preventSpaces(e) {
        //This function will prevent a user from adding spaces to their username 
        if(e.keyCode === 32) {
            e.preventDefault();
            return false;
        }
    }

    function handleBirthdateChange(e, newVal) {
        //Function that will handle birthday change and ensure the user is at least 13 years old 
        let currentTime = Date.now();
        let utcBirthDateTime = new Date(newVal);
        if(currentTime - utcBirthDateTime < 410240038000) {
            swal(
                'Uh Oh!',
                'You must be at least 13 years old to sign up for GeoCities!',
                'error',
            );
        }
        else {
            setBirthDate(newVal);
        }
    }

    function handleInterestsChange(e) {
        //This function will add interests to the interests state variable 
        if(e.target.checked) {
            if(interests.length <= 9) {
                setInterests(interests => [...interests, e.target.value]);
            }
            else {
                swal(
                    'Uh Oh!',
                    'You can only select up to 10 interests!',
                    'error',
                );
            }
        }
        else if(!e.target.checked) {
            setInterests(interests.filter(interest => interest !== e.target.value));
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

    function handleAgreementChange(e) {
        if(e.target.checked) {
            setAgreeToTerms(true);
        }
        else if(!e.target.checked) {
            setAgreeToTerms(false);
        }
    }

    function facebookResponse(res) {
        let userFirstLast = firstName + ' ' + lastName;
        facebookName = res.name;
        if(res.name !== userFirstLast) {
            swal(
                'Uh Oh!',
                'Your first and last name much match your first and last name on Facebook!',
                'error',
            );
        }
        else {
            swal(
                'Whoo!',
                'Your first and last name matches your Facebook first and last name',
                'info',
            );
        }
    }

    async function formSubmit() {
        //This function will handle submitting the form to the server 
        setOpen(true);
        let curDate = Date.now();
        let bDate = new Date(birthdate).getTime();
        let validForm = await formRef.current.isFormValid();
        if(!validForm) {
            swal(
                'Uh Oh!',
                'Make sure you filled out each form field properly, including required fields',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(curDate - bDate < 410240038000) {
            swal(
                'Uh Oh!',
                'You must be at least 13 years old to sign up!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(!town) {
            swal(
                'Uh Oh!',
                'You must enter the city you live in or one that is nearby!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(interests.length < 1) {
            swal(
                'Uh Oh!',
                'You must enter at least one interest!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(interests.length > 10) {
            swal(
                'Uh Oh!',
                'You cannot enter more than 10 interests!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(!avatar) {
            swal(
                'Uh Oh!',
                'You must submit an avatar profile picture!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(agreeToTerms === false) {
            swal(
                'Uh Oh!',
                'You must agree to the terms of service to join GeoCities!',
                'error',
            );
            setOpen(false);
            return false;
        }
        else if(firstName + ' ' + lastName !== facebookName) {
            swal(
                'Uh Oh!',
                `Your first and last name must match your Facebook first and last name!: ${firstName} ${lastName} ${facebookName}`,
                'error',
            );
            setOpen(false);
            return false;
        }
        else {
            let fd = new FormData();
            fd.append('username', username);
            fd.append('password', password);
            fd.append('firstName', firstName);
            fd.append('lastName', lastName);
            fd.append('email', email.trim());
            fd.append('birthDate', birthdate);
            fd.append('utcBirthdate', new Date(birthdate).getTime());
            fd.append('dateCreated', Date.now());
            fd.append('town', town);
            fd.append('userState', userState);
            fd.append('college', college);
            fd.append('interests', interests);
            fd.append('twitterHandle', twitterHandle);
            fd.append('instaHandle', instaHandle);
            fd.append('youtubeChannel', youtubeChannel);
            fd.append('bio', bio);
            fd.append('currentLocation', currentLocation);
            fd.append('avatar', avatar, 'avatar.jpg');
            fd.append('profileTheme', profileTheme);

            return axios({
                method: 'POST',
                data: fd,
                url: 'http://192.168.0.9:3001/api/signup',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                if(response.data.user) {
                    props.dispatch({type: 'user/updateUser', payload: response.data.user});
                    props.dispatch({type: 'ThemeChange', payload: response.data.user.profileTheme});
                    swal(
                        'Great!',
                        'You successfully joined GeoCities! Search posts, connect with others, join communities, and have fun!',
                        'success',
                    );
                    setOpen(false);
                    history.push('/profile');
                }
                else if(response.data === 'username taken') {
                    swal(
                        'Uh Oh!',
                        'That username is taken! Please select another one.',
                        'error',
                    );
                    setOpen(false);
                }
            }).catch(err => {
                console.log(err.message);
                setOpen(false);
                swal(
                    'Uh Oh!',
                    'There was an error signing you up! Please try again',
                    'error',
                );
            });
        }
    }

    return (
        <Grid 
            container 
            style={{
                marginTop: 100,
            }}
        >
            <Grid 
                item 
                xs={12} 
            >
                <Backdrop 
                    open={open} 
                >
                    <Box 
                        mb={3} 
                    >
                        <CircularProgress 
                            color='primary' 
                        />
                    </Box>
                    <Box>
                        <Typography 
                            variant='body1' 
                            component='p' 
                        >
                            Loading...
                        </Typography>
                    </Box>
                </Backdrop>
                <Card 
                    className={classes.card} 
                    hidden={open}
                >
                    <CardContent>
                        <Typography 
                        variant='h6' 
                        component='h6' 
                        align='center'
                        >
                            Sign up today!
                            <SvgIcon  
                                style={{
                                    color: 'rgb(0, 20, 60)',
                                }}
                            >
                                <path d="M 10.050781 0.222656 C 9.261719 0.355469 8.6875 0.765625 8.472656 1.363281 C 8.402344 1.558594 8.394531 1.902344 8.449219 2.085938 C 8.621094 2.644531 9.289062 3.136719 9.988281 3.226562 C 10.082031 3.234375 10.347656 3.246094 10.574219 3.242188 C 11.0625 3.238281 11.152344 3.257812 11.332031 3.414062 C 11.5 3.5625 11.566406 3.738281 11.585938 4.046875 C 11.589844 4.179688 11.585938 4.332031 11.574219 4.386719 L 11.550781 4.480469 L 11.214844 4.503906 C 8.734375 4.695312 6.742188 5.953125 5.914062 7.84375 C 5.265625 9.324219 5.53125 11.039062 6.597656 12.300781 C 6.824219 12.570312 7.167969 12.90625 7.351562 13.035156 C 7.410156 13.078125 7.460938 13.117188 7.460938 13.121094 C 7.460938 13.125 7.359375 13.179688 7.230469 13.238281 C 6.515625 13.582031 5.902344 14.085938 5.648438 14.535156 C 5.445312 14.898438 5.371094 15.320312 5.460938 15.632812 C 5.617188 16.203125 6.226562 16.734375 7.144531 17.109375 C 7.308594 17.175781 7.433594 17.230469 7.425781 17.234375 C 7.421875 17.238281 7.292969 17.285156 7.140625 17.339844 C 5.796875 17.804688 4.949219 18.566406 4.664062 19.566406 C 4.582031 19.851562 4.574219 20.457031 4.648438 20.691406 C 4.828125 21.277344 5.1875 21.757812 5.785156 22.230469 C 6.644531 22.902344 7.910156 23.375 9.476562 23.597656 C 10.308594 23.71875 10.734375 23.746094 11.914062 23.746094 C 12.980469 23.746094 13.308594 23.734375 14.046875 23.664062 C 14.910156 23.578125 15.722656 23.4375 16.425781 23.253906 C 18.523438 22.695312 19.863281 21.703125 20.296875 20.386719 C 20.414062 20.035156 20.433594 19.890625 20.433594 19.449219 C 20.433594 19.085938 20.421875 18.996094 20.371094 18.808594 C 20.210938 18.242188 19.941406 17.851562 19.417969 17.445312 C 18.839844 16.992188 18.0625 16.664062 17.011719 16.4375 C 15.882812 16.1875 14.839844 16.105469 12.277344 16.074219 C 10.996094 16.058594 10.128906 16.042969 9.957031 16.03125 C 9.875 16.027344 9.707031 16.019531 9.578125 16.011719 C 8.390625 15.945312 7.71875 15.707031 7.449219 15.261719 C 7.375 15.144531 7.367188 15.101562 7.367188 14.945312 C 7.367188 14.78125 7.375 14.753906 7.464844 14.609375 C 7.519531 14.523438 7.617188 14.40625 7.679688 14.347656 C 7.832031 14.210938 8.136719 14.023438 8.386719 13.914062 L 8.59375 13.824219 L 8.691406 13.871094 C 8.949219 13.996094 9.578125 14.21875 9.902344 14.300781 C 12.304688 14.929688 14.867188 14.4375 16.605469 13.019531 C 18.023438 11.859375 18.652344 10.246094 18.296875 8.664062 C 18.117188 7.855469 17.640625 7.050781 16.949219 6.378906 C 16.722656 6.15625 16.144531 5.714844 15.871094 5.550781 C 15.1875 5.144531 14.410156 4.835938 13.644531 4.660156 C 13.386719 4.601562 12.800781 4.511719 12.683594 4.511719 C 12.628906 4.511719 12.582031 4.503906 12.570312 4.492188 C 12.5625 4.480469 12.578125 4.363281 12.609375 4.234375 C 12.699219 3.8125 12.734375 3.5 12.734375 3.003906 C 12.730469 2.464844 12.691406 2.203125 12.558594 1.796875 C 12.273438 0.953125 11.609375 0.386719 10.734375 0.242188 C 10.574219 0.214844 10.175781 0.203125 10.050781 0.222656 Z M 12.519531 6.125 C 14.375 6.332031 15.828125 7.410156 16.210938 8.871094 C 16.265625 9.058594 16.273438 9.167969 16.273438 9.519531 C 16.273438 9.882812 16.265625 9.972656 16.210938 10.183594 C 15.96875 11.101562 15.3125 11.871094 14.34375 12.378906 C 13.535156 12.804688 12.53125 13.011719 11.59375 12.945312 C 10.949219 12.898438 10.546875 12.8125 9.96875 12.585938 C 8.765625 12.117188 7.933594 11.265625 7.640625 10.203125 C 7.5625 9.90625 7.554688 9.183594 7.632812 8.886719 C 8.003906 7.429688 9.464844 6.335938 11.308594 6.125 C 11.636719 6.089844 12.191406 6.085938 12.519531 6.125 Z M 9.394531 17.675781 C 9.945312 17.738281 10.980469 17.777344 12.8125 17.816406 C 14.164062 17.84375 14.667969 17.863281 15.253906 17.933594 C 15.9375 18.007812 16.398438 18.109375 16.84375 18.269531 C 17.6875 18.574219 18.121094 19.050781 18.121094 19.660156 C 18.121094 20.058594 17.925781 20.394531 17.492188 20.726562 C 16.746094 21.304688 15.425781 21.6875 13.632812 21.855469 C 13.140625 21.902344 11.339844 21.910156 10.894531 21.867188 C 9.703125 21.753906 8.859375 21.570312 8.21875 21.285156 C 7.699219 21.054688 7.308594 20.742188 7.121094 20.414062 C 6.972656 20.148438 6.929688 19.777344 7.015625 19.460938 C 7.191406 18.816406 7.855469 18.191406 8.832031 17.746094 C 8.953125 17.691406 9.066406 17.644531 9.082031 17.644531 C 9.097656 17.644531 9.238281 17.660156 9.394531 17.675781 Z M 9.394531 17.675781" />
                                <path d="M 11.617188 8.546875 C 11.261719 8.625 10.957031 8.828125 10.792969 9.101562 C 10.691406 9.261719 10.691406 9.269531 10.691406 9.527344 C 10.691406 9.792969 10.691406 9.792969 10.796875 9.960938 C 11.070312 10.394531 11.644531 10.617188 12.242188 10.519531 C 12.75 10.433594 13.160156 10.082031 13.238281 9.667969 C 13.328125 9.171875 12.929688 8.691406 12.320312 8.550781 C 12.144531 8.511719 11.792969 8.507812 11.617188 8.546875 Z M 11.617188 8.546875 "/>
                            </SvgIcon>
                        </Typography>
                        <ValidatorForm 
                            ref={formRef}
                            onSubmit={e => e.preventDefault()}
                        >
                            <TextValidator 
                                type='text' 
                                label='Username'
                                placeholder='Username'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                onKeyDown={preventSpaces}
                                color='primary'
                                variant='outlined'
                                className={classes.topField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                aria-label='Username'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText='Username must be between 6 and 24 characters, can only contain letters, numbers, and underscores, and must start with a letter!'
                                validators={['usernameValid', 'enoughCharacters', 'validStartChar', 'tooManyChars']}
                                errorMessages={['Username can only consist of letters numbers and underscores. Must start with a letter!', 'Username must be at least 6 characters long!', 'Username must start with a letter!', 'Username cannot be more than 24 characters long!']}
                                fullWidth
                                required
                            />
                            <TextValidator 
                                className={classes.topMarg}
                                type='password'
                                label='Password'
                                placeholder='Password'
                                value={password}
                                onChange={e => setPasssword(e.target.value)}
                                variant='outlined' 
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                aria-label='Password' 
                                helperText='Password must be at least 6 characters long!'
                                validators={['enoughCharacters']}
                                errorMessages={['Password must be at least 6 characters long!']}
                                fullWidth 
                                required 
                            />
                            <TextValidator 
                                className={classes.topMarg}
                                type='text' 
                                label='First name'
                                placeholder='First name' 
                                value={firstName}
                                onChange={e => setFirstname(e.target.value)} 
                                variant='outlined' 
                                color='primary'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                aria-label='First name' 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText='First name must match the first name used on your Facebook profile!'
                                validators={['isFilled']}
                                errorMessages={['First name must match the first name used on your Facebook profile!']}
                                fullWidth 
                                required 
                            />
                            <TextValidator 
                                className={classes.topMarg} 
                                type='text'
                                label='Last name'
                                placeholder='Last name'
                                value={lastName}
                                onChange={e => setLastname(e.target.value)}
                                variant='outlined'
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                aria-label='Last name' 
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <AccountCircleIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText='Last name must match the last name used on your Facebook profile!'
                                validators={['isFilled']}
                                errorMessages={['Last name must match the last name used on your Facebook profile!']}
                                fullWidth 
                                required 
                            />
                            <TextValidator 
                                className={classes.topMarg}
                                type='email'
                                label='Email'
                                placeholder='Email'
                                value={email}
                                onKeyDown={preventSpaces}
                                onChange={e => setEmail(e.target.value)}
                                helperText='Must enter a valid email!'
                                variant='outlined' 
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <EmailIcon />
                                        </InputAdornment>
                                    )
                                }}
                                aria-label='Email'
                                validators={['isFilled', 'mailValid']}
                                errorMessages={['Must enter an email address!', 'Email must be valid!']}
                                fullWidth 
                                required 
                            />
                            <Autocomplete 
                                className={classes.topMarg} 
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
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1' 
                                component='p' 
                            >
                                Select your state!
                            </Typography>
                            <Select 
                                value={userState} 
                                onChange={e => setUserState(e.target.value)} 
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
                            <Autocomplete 
                                className={classes.topMarg} 
                                value={college}
                                onChange={(e, newVal) => setCollege(newVal)}
                                options={myColleges}
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
                                        label='College' 
                                        placeholder='College'
                                        helperText='Select your college or "None" if you did not attend!'
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        fullWidth 
                                        required 
                                    />
                                )}
                            />
                            <MuiPickersUtilsProvider 
                                utils={FnsUtils}
                                className={classes.topMarg} 
                            >
                                <KeyboardDatePicker 
                                    className={classes.topMarg}
                                    variant='inline' 
                                    label='Birthdate'
                                    aria-label='Birthdate selector'
                                    format='MM/dd/yyyy'
                                    value={birthdate}
                                    onChange={handleBirthdateChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    helperText='You must be at least 13 years old to sign up for GeoCities!'
                                />
                            </MuiPickersUtilsProvider>
                            <FormControl 
                                className={classes.topMarg} 
                                component='fieldset' 
                            >
                                <FormLabel 
                                    component='legend' 
                                >
                                    Select at least 1 interest and up to 10 interests!
                                </FormLabel>
                                <FormGroup 
                                    column 
                                >
                                    {interestsList.map((interest, index) => (
                                        <FormControlLabel 
                                            key={index.toString()}
                                            value={interest}
                                            onChange={handleInterestsChange}
                                            label={interest}
                                            labelPlacement='end' 
                                            control={
                                                <Checkbox 
                                                    color='primary'
                                                    checked={interests.includes(interest)}
                                                />
                                            }
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                            <TextField 
                                className={classes.topMarg}
                                label='Twitter handle'
                                placeholder='Twitter handle (optional)'
                                value={twitterHandle}
                                onChange={e => setTwitterHandle(e.target.value)}
                                variant='outlined'
                                color='primary'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <Icon 
                                                path={mdiTwitter} 
                                                size={1} 
                                            />
                                        </InputAdornment>
                                    )
                                }}
                                helperText='Add your Twitter handle for people to connect with you.'
                                fullWidth
                            />
                            <TextField 
                                className={classes.topMarg}
                                label='Instagram handle'
                                placeholder='Instagram handle (optional)'
                                value={instaHandle}
                                onChange={e => setInstaHandle(e.target.value)}
                                variant='outlined' 
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <Icon 
                                                path={mdiInstagram}
                                                size={1} 
                                            />
                                        </InputAdornment>
                                    )
                                }}
                                helperText='Add your instagram handle for people to connect with you.'
                                fullWidth 
                            />
                            <TextField 
                                className={classes.topMarg} 
                                label='Youtube channel'
                                placeholder='Youtube channel url link (optional)'
                                value={youtubeChannel}
                                onChange={e => setYoutubeChannel(e.target.value)}
                                variant='outlined'
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position='start' 
                                        >
                                            <Icon 
                                                path={mdiYoutube} 
                                                size={1} 
                                            />
                                        </InputAdornment>
                                    )
                                }}
                                helperText='Add the url link for your Youtube channel to increase engagement.' 
                                fullWidth 
                            />
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1' 
                                component='p' 
                            >
                                You must upload an avatar image for your profile!
                            </Typography>
                            <label 
                                className={classes.topMarg} 
                                html-for='avatar' 
                            >
                                <input 
                                    className={classes.input} 
                                    type='file'
                                    name='avatar' 
                                    id='avatar' 
                                    accept='image/jpg, image/jpeg, image/png' 
                                    onChange={handleAvatarChange}
                                    capture
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
                            <Typography 
                                className={classes.topMarg} 
                                variant='body1'
                                component='p' 
                            >
                                Select a profile theme color!
                            </Typography>
                            <SwatchesPicker 
                                color={profileTheme} 
                                onChange={color => setProfileTheme(color.hex)} 
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
                                variant='subtitle1'
                                component='p' 
                                color={bio.length > 300 ? 'error' : 'default'}
                            >
                                Bio length: {bio.length}/300
                            </Typography>
                            <TextValidator 
                                label='Bio'
                                placeholder='Enter a brief bio about yourself. Must be at least 20 characters long and can only be up to 300 characters.'
                                helperText='Bio must be at least 20 characters long and can only be up to 300'
                                value={bio}
                                onChange={e => setBio(e.target.value)} 
                                validators={['minBio', 'maxBio']}
                                errorMessages={['Bio must be at least 20 characters!', 'Bio can only be 300 characters long!']}
                                variant='outlined' 
                                color='primary' 
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                multiline 
                                rows={4}
                                fullWidth
                                required 
                            />
                            <Accordion 
                                className={classes.topMarg}
                            >
                                <AccordionSummary
                                    expandIcon={<ChevronDownIcon />}
                                >
                                    <FormControlLabel 
                                        value={agreeToTerms}
                                        onChange={handleAgreementChange}
                                        label='Agree to terms of service' 
                                        labelPlacement='start' 
                                        control={
                                            <Checkbox 
                                                color='primary' 
                                                checked={agreeToTerms}
                                            />
                                        }
                                    />
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography 
                                        variant='body1' 
                                        component='p' 
                                    >
                                        You must be at least 13 years old to join GeoCities. Please agree to be respectful to other users. Debate is okay, but disrespect is not. Disrespect, hate, and violence will not be tolerated on the platform. Any illegal content is not approved by GeoCities and is forbidden from being posted on the platform. Fake accounts are not approved by GeoCities and your real identity must be used. 
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <FacebookLogin 
                                appId='145621200485572'
                                autoLoad={false}
                                fields='name,email,picture'
                                callback={facebookResponse}
                                isMobile={false}
                                render={renderProps => (
                                    <Button 
                                        variant='contained' 
                                        color='primary' 
                                        onClick={renderProps.onClick} 
                                        className={classes.topMarg}
                                    >
                                        Facebook verification
                                    </Button>
                                )}
                            />
                            <br></br>
                            <Button 
                                className={classes.topMarg} 
                                color='primary'
                                variant='contained'
                                onClick={formSubmit}
                            >
                                Finalize Registration
                            </Button>
                        </ValidatorForm>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        theme: state.userThemeReducer.primary,
    };
}

export default connect(mapStateToProps)(Signup);