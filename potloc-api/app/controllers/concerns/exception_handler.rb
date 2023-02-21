# frozen_string_literal: true

module ExceptionHandler
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError do |e|
      status = :internal_server_error
      render json: { message: e.message, backtrace: e.backtrace[0..10] }, status: status
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      render json: { message: e.message }, status: :unprocessable_entity
    end

    rescue_from ActiveRecord::RecordNotFound do |e|
      model_name = e.model.constantize&.model_name&.human
      render json: { message: 'Not found', model: model_name }, status: :not_found
    end
  end
end
