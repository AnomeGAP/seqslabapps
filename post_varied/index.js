/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const needle = require('needle');

async function post(context, vcf, tissue) {
    formdata = {
        "variants_list": vcf,
        "format": "freq",
        "Genomes": ["1000Genomes_EAS", "1000Genomes_AMR", "1000Genomes_AFR", "1000Genomes_EUR", "1000Genomes_SAS"],
        "JPN": "2KJPN",
        "ESP": ["ESP_AA", "ESP_EA"],
        "TWB": ["TWB_GWG", "TWB_NGS"],
        "ExAC": ["ExAC_AFR", "ExAC_AMR", "ExAC_EAS", "ExAC_FIN", "ExAC_NFE", "ExAC_SAS"],
        "anno": ["gnomad_genome", "dbnsfp30a"],
        "gnomad_genome": "gnomAD_genome_ALL",
        "REVEL_threshold": "0.5",
        "Polyphen2": ["Polyphen2_HDIV_score", "Polyphen2_HVAR_score", "Polyphen2_HDIV_pred", "Polyphen2_HVAR_pred"],
        "ClinVar": "ClinVar",
        "dbSNP": "dbSNP_b152_GRCh37p13",
        "exp_out": "TPM",
        "target_tissue": tissue,
        "tissue": tissue,
    };
    return needle('post', "http://varied.cgm.ntu.edu.tw/Variants_search", formdata, { multipart: true })
        .then(function(response) {
            return response.body;
        })
        .catch(function(error) {
            context.log(error);
            return '<!DOCTYPE html><html><head><title>VariED</title></head><body><p>Service Unavailable. Please try again later.</p></body></html>';
        })
}

module.exports = async function (context, msg) {
    let body = await post(context, msg.vcf, msg.tissue);
    return body;
}