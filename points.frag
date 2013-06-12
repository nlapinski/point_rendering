<Node>
  <DefaultName>SvgPoints</DefaultName>
  <Description>Paint Procedural Points</Description>
  <Cost>0.1</Cost>
  <CostDescription>Rendering Point Data for Masking</CostDescription>
  <Inputs>
    <Input Name="Input"/>
  </Inputs>
 
  <Attributes>
    <Attribute Name="tX" PrettyName="tX" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>
    <Attribute Name="tY" PrettyName="tY" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>
    <Attribute Name="tZ" PrettyName="tZ" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>

    <Attribute Name="Pitch" PrettyName="rX" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>
    <Attribute Name="Yaw" PrettyName="rY" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>
    <Attribute Name="Roll" PrettyName="rZ" Group="POS" Type="float" Min="-1000.0" Max="1000.0">0.0</Attribute>

    <Attribute Name="Rad" PrettyName="Radius" Group="Drawing" Type="float" Min="0.0001" Max="2.0">0.5</Attribute>
    <Attribute Name="CircleEdge" Group="Drawing" Type="curve"> </Attribute>
    <Attribute Name="PointsIn" PrettyName="Points Image" Group="Drawing" Type="image"></Attribute>
 
    <Attribute Name="Mask" PrettyName="Mask" Group="Debug" Type="bool">false</Attribute>
    <Attribute Name="DebugPOS" PrettyName="Debug POS" Group="Debug" Type="bool">false</Attribute>

    <Attribute Name="Animted" PrettyName="Animated" Group="Animation" Type="bool">false</Attribute>
    <Attribute Name="TimeOffset" PrettyName="Time Offset" Group="Animation" Type="float" Min="-100.0" Max="100.0">0.0</Attribute>
    <Attribute Name="TimeScale" PrettyName="Time Scale" Group="Animation" Type="float" Min="0.0" Max="100.0">1.0</Attribute> 

    <Attribute Name="objScale" PrettyName="objScale" Group="POS" Type="float" Min="0.0" Max="100.0">1.0</Attribute> 
 
</Attributes>

    <Contexts>
        <Context Type="NodeGraphView">
            <Inputs>
                <Input Name="Input"><Pos>0,-50</Pos></Input>
            </Inputs>
        </Context>
        <Context Type="GLSL">
            <Shader ShaderType='Fragment'>
                <Inputs>
                    <Input Name="Input"> <Default>vec4(State.fragmentPos_inObjSpace,0)</Default> </Input>
                </Inputs>
            </Shader>
          
            <Shader ShaderType='TessEvaluation'>
                <Inputs>
                    <Input Name="Input"> <Default>vec4(State.position.xyz,0)</Default> </Input>
                </Inputs>
            </Shader>
     
            <Shader>
               <Body><![CDATA[

//UV cords
vec2 uv = State.UV;

//misc
float time = ((($TimeOffset+current_frame))+.0001)*$TimeScale;
//   


float Pi = 3.14159265358979323846264;
float Yaw = $Yaw * Pi / 180.0;
float Pitch = $Pitch * Pi / 180.0;
float Roll = $Roll * Pi / 180.0;

float CosYaw = cos( Yaw );
float SinYaw = sin( Yaw );
float CosPitch = cos( Pitch );
float SinPitch = sin( Pitch );
float CosRoll = cos( Roll );
float SinRoll = sin( Roll );

mat3 Orientation;
Orientation[ 0 ][ 0 ] = CosYaw * CosRoll;
Orientation[ 0 ][ 1 ] = SinYaw * SinPitch - CosYaw * SinRoll * CosPitch;
Orientation[ 0 ][ 2 ] = CosYaw * SinRoll * SinPitch + SinYaw * CosPitch;
Orientation[ 1 ][ 0 ] = SinRoll;
Orientation[ 1 ][ 1 ] = CosRoll * CosPitch;
Orientation[ 1 ][ 2 ] = -CosRoll * SinPitch;
Orientation[ 2 ][ 0 ] = -SinYaw * CosRoll;
Orientation[ 2 ][ 1 ] = SinYaw * SinRoll * CosPitch + CosYaw * SinPitch;
Orientation[ 2 ][ 2 ] = -SinYaw * SinRoll * SinPitch + CosYaw * CosPitch;

vec3 Offset =  #Input.rgb - vec3( $tX, $tY, $tZ ) - object_center;
Offset=Offset*object_radius;
vec3 Ray = normalize( Offset );
Ray = Orientation * Ray;

vec4 coords=normalize(vec4(Ray,1.0));
coords=(1.0+coords)/2.0;
coords=coords*$objScale;

vec4 pt;



float size_pow = (pow(time,$Rad*$Rad)-1.0) + 0.0001;

    vec4 h1;
    vec4 h2;
    vec4 h3;
    vec4 fetch;
    vec4 pfetch;

    float opacity=0.0;

    int ts = int(textureSize($PointsIn, 0).x);


    for(int i =0; i < ts; i += 1){

        fetch=texelFetch($PointsIn,ivec2(i,0),0);


        opacity+=mix(0.0,1.0,curve_lookup($CircleEdge,1.0-length((coords-fetch)/(size_pow))));

 
    }


if($DebugPOS==false){
    Output = vec4(opacity);
}
else{
Output=coords-vec4(opacity);

Output.a=1.0;
}
 
                ]]></Body>
            </Shader>
 
        </Context>
    </Contexts>
</Node> 