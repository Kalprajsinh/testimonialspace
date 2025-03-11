const z = require("zod");

const Organizationdata = z.object({
    name:z.string(),
    logo:z.string(),
    title:z.string(),
    message:z.string()
});

const userdatatext = z.object({
    name:z.string(),
    email:z.string().email(),
    photo:z.string(),
    text:z.string(),
    star:z.number(),
    organizationName:z.string(),
    favorite:z.boolean().optional()
})

const userdatavideo = z.object({
    name:z.string(),
    email:z.string().email(),
    photo:z.string(),
    video:z.string(),
    star:z.number(),
    organizationName:z.string(),
    favorite:z.boolean().optional()
})

module.exports = {
    Organizationdata,
    userdatatext,
    userdatavideo
}

