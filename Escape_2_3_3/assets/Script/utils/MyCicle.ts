
/*
圆形自定义类

*/

export default class MyCicle
{
    //圆心点
    m_center_pt:cc.Vec2 = null;
    //半径
    m_radius:number = 0;
    constructor(centerpt:cc.Vec2,radius:number)
    {
        this.m_center_pt = centerpt;
        this.m_radius = radius;
    }

}