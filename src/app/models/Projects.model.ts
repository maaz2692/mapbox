import { Deserializable } from './deserializable.model';

export class ProjectsModel implements Deserializable {
  project_url?: string;
  project_id?: string;
  project_stub?: string;
  project_image?: string;
  information?: {
    title: string;
    category: string;
    application_date: string;
    construction_status: string;
    replacement_project: string;
    construction_began: string;
    master_project: string;
    completion_date: string;
    updated_date: string;
  };
  description?: {
    project_description: string;
  };
  project_information?: {
    street_address: string;
    geo_location: string;
    project_url: string;
    city: string;
    other_addresses: string;
    province: string;
    municipality: string;
    postal_code: string;
    ward: string;
    country: string;
    mls_zone: string;
  };
  project_attributes?: {
    far_fsi: string;
    crane_number: string;
    site_area: string;
    herbitage: string;
    number_of_buildings: string;
    height_meters: string;
    storeys: string;
    underground_levels: string;
  };
  units?: {
    building_units: string;
    hotel_units: string;
    total_number_of_units: string;
    freehold_units: string;
    rental_units: string;
    other_units: string;
    condo_units: string;
    residential_units: string;
    affordable_units: string;
  };
  unit_mix?: {
    studios: string;
    '1_bedrooms': string;
    '2_bedrooms': string;
    '3_plus_bedrooms': string;
  };
  ground_floor_area?: {
    total_gfa_sq_meters: string;
    office_gfa_sq_meters: string;
    commerical_gfa_sq_meters: string;
    residential_gfa_sq_meters: string;
    industrial_gfa_sq_meters: string;
    retail_gfa_sq_meters: string;
    institutional_gfa_sq_meters: string;
  };
  parking?: {
    total_vehicular_parking: string;
    office_parking: string;
    residential_parking: string;
    industrial_parking: string;
    visitor_parking: string;
    institutional_other_parking: string;
    retail_parking: string;
    bike_parking: string;
  };
  access_and_services?: {
    road_access: string;
    mass_timber: string;
    municipal_water: string;
    municipal_sanitary_sewers: string;
    municipal_storm_sewers: any;
    green_standards: string;
    leed_certified: string;
    passive_home_certified: string;
    other_septic: string;
  };
  minimum_setbacks?: {
    front_lot_line_direction: string;
    front_lot_line_existing: string;
    front_lot_line_proposed: string;
    side_lot_line1_direction: string;
    side_lot_line1_existing: string;
    side_lot_line1_proposed: string;
    rear_lot_line_direction: string;
    rear_lot_line_existing: string;
    rear_lot_line_proposed: string;
    side_lot_line2_direction: string;
    side_lot_line2_existing: string;
    side_lot_line2_proposed: string;
  };
  applications?: {
    submission_dates: string;
    devapp_urls: string;
    application_types: string;
    approval_status: string;
    approval_sub_status: string;
    application_nos: string;
    council_decision_urls: string;
    council_decision_dates: string;
    appeal_received_dates: string;
    mzo_nos: string;
    mzo_dates: string;
    olt_urls: string;
    olt_nos: string;
    olt_decision_dates: string;
  };
  permits?: {
    demolition_application_date: string;
    demolition_issue_date: string;
    demolition_closing_date: string;
    demolition_permit_number: string;
    shoring_application_date: string;
    shoring_issue_date: string;
    shoring_closing_date: string;
    shoring_permit_number: string;
    new_building_application_date: string;
    new_building_issue_date: string;
    new_building_closing_date: string;
    new_building_permit_number: string;
  };
  forums?: {
    forum_project: string;
    forum_real_estate: string;
    forum_transit: string;
  };
  developer?: {
    logo: string;
    url: string;
    name: string;
    location: string;
  };
  details?: {
    projectImageURLs: [string];
  };
  type?: string;
  project_image_600?: string;
  locality?: string;
  province?: string;
  project_gpt_description?: string;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
